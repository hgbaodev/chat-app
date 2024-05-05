import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from .serializers import MessageSerializer, AttachmentSerializer
from .models import Message, Conversation, Participants, OnlineUser, Attachments, NameCard, CallMessage
from authentication.models import User
from rest_framework_simplejwt.tokens import AccessToken
import base64
import json
import secrets
import cloudinary.uploader

class ChatConsumer(WebsocketConsumer):
    call_store = {}

    def connect(self):
        token = self.scope["url_route"]["kwargs"]["token"]
        
        access_token_obj = AccessToken(token)
        user_id = access_token_obj['user_id']
        user = User.objects.get(id=user_id)

        self.scope["user"] = user
        if user.is_authenticated:
            self.room_name = user.id
            self.room_group_name = f"user_{self.room_name}"
            async_to_sync(self.channel_layer.group_add)(
                self.room_group_name, self.channel_name
            )
            check = OnlineUser.objects.filter(user=self.scope["user"])
            self.accept()
            if not check:
                OnlineUser.objects.create(user=user)
                conversations = Conversation.objects.filter(participants__user=user)
                related_users = set()
                for conversation in conversations:
                    users = User.objects.filter(participants__conversation=conversation).exclude(id=user.id)
                    related_users.update(users)
                related_users_online = [user for user in related_users if OnlineUser.objects.filter(user=user.id).exists()]
                for online_user in related_users_online:
                    async_to_sync(self.channel_layer.group_send)(
                        f"user_{online_user.id}", 
                        {
                            "type": "online_notification",
                            "message": {
                                "user_id": user.id,
                                "status": True
                            } 
                        }
                    )
            
        else:
            self.close()

    def disconnect(self, close_code):
        user = self.scope["user"]
        OnlineUser.objects.filter(user=self.scope["user"]).delete()
        conversations = Conversation.objects.filter(participants__user=user)
        related_users = set()
        for conversation in conversations:
            users = User.objects.filter(participants__conversation=conversation).exclude(id=user.id)
            related_users.update(users)
        related_users_online = [user for user in related_users if OnlineUser.objects.filter(user=user.id).exists()]
        for online_user in related_users_online:
            async_to_sync(self.channel_layer.group_send)(
                f"user_{online_user.id}", 
                {
                    "type": "online_notification",
                    "message": {
                        "user_id": user.id,
                        "status": False,
                    } 
                }
            )
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )


    def receive(self, text_data):
        data = json.loads(text_data)
        data_source = data.get('source')
        
        if data_source == "message_send":
            self.receive_message_send(data)
        elif data_source == "init_call":
            self.receive_init_call(data)
        elif data_source == "accept_video_call":
            self.receive_accept_video_call(data)
        elif data_source == "refuse_video_call":
            self.receive_refuse_video_call(data)
        elif data_source == "leave_video_call":
            self.receive_leave_video_call(data)
        elif data_source == "cancel_video_call":
            self.receive_cancel_video_call(data)
        elif data_source == "end_video_call":
            self.receive_end_video_call(data)
        elif data_source == "get_peer_ids":
            self.receive_get_peer_ids(data)
        elif data_source == "typing_indicator":
            self.receive_typing_indicator(data)
        
    def receive_typing_indicator(self, data):
        conversation_id = data["conversation_id"]
        typing = data["typing"]
        user = self.scope["user"]
        
        user_dict = {
            'conversation_id': conversation_id,
            'user_id': user.id,
            'fullname': user.first_name + ' ' + user.last_name,
            'typing': typing
        }
        
        participants = Participants.objects.filter(conversation_id=conversation_id).exclude(user=self.scope["user"])
        for participant in participants:
            room_group_name = f"user_{participant.user.id}"
            async_to_sync(self.channel_layer.group_send)(
                room_group_name, {"type": "typing_indicator", "message": json.dumps(user_dict)}
                )
        
    def receive_message_send(self, data):
        message = data["message"]
        attachment = data["attachment"]
        namecard = data["namecard"]
        message_type = data.get("message_type", Message.MessageType.TEXT)
        conversation_id = data["conversation_id"]
        sender = self.scope["user"]
        
        if "forward" in data:
            forward_message_id = data["forward"]
            try:
                forward = Message.objects.get(id=forward_message_id)
            except Message.DoesNotExist:
                forward = None
        else:
            forward = None
            
        conversation = Conversation.objects.get(id=conversation_id)
        # Create message
        message = Message.objects.create(
            conversation=conversation,
            sender=sender,
            message=message,
            message_type=message_type,
            forward=forward
        )
        
        #Upload file
        if attachment:
            decoded_file = base64.b64decode(attachment.get("base64").split(",")[1])
            file_name = f"{secrets.token_hex(8)}"
            upload_result = cloudinary.uploader.upload(decoded_file,public_id=file_name,resource_type="auto")
            
            Attachments.objects.create(
                    message=message,
                    file_name=attachment.get("file_name"),
                    file_size=attachment.get("file_size"),
                    file_type=attachment.get("file_type"),
                    file_url=upload_result["url"]
                )
        
        if namecard:
            NameCard.objects.create(
                message=message,
                user= User.objects.get(pk=namecard),
            )
            
        participants = Participants.objects.filter(conversation_id=conversation_id)
        message_serializer = MessageSerializer(instance=message)
       
        for participant in participants:
            room_group_name = f"user_{participant.user.id}"
            if(data.get("conversation")):
                async_to_sync(self.channel_layer.group_send)(
                room_group_name, {"type": "chat_message", "message": message_serializer.data, "conversation": data.get("conversation")}
                )
            else:
                async_to_sync(self.channel_layer.group_send)(
                room_group_name, {"type": "chat_message", "message": message_serializer.data}
                )

    def receive_init_call(self, data):
        conversation_id = data["conversation_id"]
        peer_id = data["peer_id"]
        call_type = data["type"]

        if conversation_id in self.call_store:
            if self.call_store[conversation_id] != {}:
                return
           
        # init call store
        self.call_store[conversation_id] = {
            'type': call_type,
            'members': [
            {
                'peer_id': peer_id, 
                'user_id': self.scope["user"].id,
                'name': f'{self.scope["user"].first_name} {self.scope["user"].last_name}',
                'avatar': self.scope["user"].avatar
            }]
        }
        
        conversation = Conversation.objects.get(id=conversation_id)
        conversation_type = conversation.type
        conversation_title =self.scope["user"].first_name + ' ' + self.scope["user"].last_name
        conversation_images = [self.scope["user"].avatar]
        if conversation.type == Conversation.ConversationType.GROUP:
            conversation_title = conversation.title
            participants =  Participants.objects.filter(conversation_id=conversation_id).all()
            conversation_images = [participant.user.avatar for participant in participants]

        message_dict = {
            'type': call_type,
            'conversation': {
                'conversation_id': conversation_id,
                'title': conversation_title,
                'images': conversation_images,
                'type': conversation_type,
            },
        }
        # create call message
        message_type = call_type == 1 and Message.MessageType.VIDEOCALL or Message.MessageType.VOICECALL
        message = Message.objects.create(
            conversation=conversation,
            sender=self.scope["user"],
            message="",
            message_type=message_type
        )
        CallMessage.objects.create(
            message=message,
        )
        message_serializer = MessageSerializer(instance=message)
        participants = Participants.objects.filter(conversation_id=conversation_id)
        for participant in participants:
            room_group_name = f"user_{participant.user.id}"
            async_to_sync(self.channel_layer.group_send)(
                room_group_name, {"type": "chat_message", "message": message_serializer.data}
                )    
            if participant.user.id != self.scope["user"].id:
                async_to_sync(self.channel_layer.group_send)(
                room_group_name, {"type": "video_call", "message": json.dumps(message_dict)}
                )
            
    def receive_accept_video_call(self, data):
        conversation_id = data["conversation_id"]
        peer_id = data["peer_id"]

        if self.scope["user"].id in [member["user_id"] for member in self.call_store[conversation_id]["members"]]:
            print('exist')
            return
        
        # append peer_id into call store
        self.call_store[conversation_id]["members"].append(
            {
                'peer_id': peer_id, 
                'user_id': self.scope["user"].id,
                'name':  f'{self.scope["user"].first_name} {self.scope["user"].last_name}', 
                'avatar': self.scope["user"].avatar
            })
        return_data = {
            'members': self.call_store[conversation_id]["members"],
        }
        participants = Participants.objects.filter(conversation_id=conversation_id).exclude(user=self.scope["user"])
        for participant in participants:
            room_group_name = f"user_{participant.user.id}"
            async_to_sync(self.channel_layer.group_send)(
                room_group_name, {"type": "accept_video_call", "message": json.dumps(return_data)}
                )
       
    def receive_refuse_video_call(self, data):
        conversation_id = data["conversation_id"]

        video_call_message = CallMessage.objects.filter(message__conversation_id=conversation_id).latest('message__created_at')
        if(video_call_message):
            video_call_message.ended = True
            video_call_message.duration = 0  
            video_call_message.save()
        
        return_data = {
            'conversation_id': conversation_id,
            'message_id': video_call_message.id,
        }

        participants = Participants.objects.filter(conversation_id=conversation_id)
        for participant in participants:
            room_group_name = f"user_{participant.user.id}"
            async_to_sync(self.channel_layer.group_send)(
                room_group_name, {"type": "refuse_video_call", "message": json.dumps(return_data)}
            )
        self.call_store[conversation_id] = {}
        
    def receive_cancel_video_call(self, data):
        conversation_id = data["conversation_id"]

        video_call_message = CallMessage.objects.filter(message__conversation_id=conversation_id).latest('message__created_at')
        if(video_call_message):
            video_call_message.ended = True
            video_call_message.duration = 0  
            video_call_message.save()

        return_data = {
            'conversation_id': conversation_id,
            'message_id': video_call_message.id,
        }
        participants = Participants.objects.filter(conversation_id=conversation_id)
        for participant in participants:
            room_group_name = f"user_{participant.user.id}"
            async_to_sync(self.channel_layer.group_send)(
                room_group_name, {"type": "cancel_video_call", "message": json.dumps(return_data)}
                )
        self.call_store[conversation_id] = {}
            
    def receive_leave_video_call(self, data):
        conversation_id = data["conversation_id"]
        peer_id = data["peer_id"]

        # remove peer_id from call store
        self.call_store[conversation_id]["members"] = list(filter(lambda member: member['peer_id'] != peer_id, self.call_store[conversation_id]["members"]))

        return_data = {
            'members': self.call_store[conversation_id]["members"],
        }
        participants = Participants.objects.filter(conversation_id=conversation_id).exclude(user=self.scope["user"])
        for participant in participants:
            room_group_name = f"user_{participant.user.id}"
            async_to_sync(self.channel_layer.group_send)(
                room_group_name, {"type": "leave_video_call", "message": json.dumps(return_data)}
                )
        # 
       

    def receive_end_video_call(self, data):
        conversation_id = data["conversation_id"]
        duration = data["duration"]
        participants = Participants.objects.filter(conversation_id=conversation_id)
        video_call_message = CallMessage.objects.filter(message__conversation_id=conversation_id).latest('message__created_at')
        if(video_call_message):
            video_call_message.ended = True
            video_call_message.duration = duration  
            video_call_message.save()

        return_data = {
            'conversation_id': conversation_id,
            'message_id': video_call_message.id,
            'duration': duration,
        }
        for participant in participants:
            room_group_name = f"user_{participant.user.id}"
            async_to_sync(self.channel_layer.group_send)(
                room_group_name, {"type": "end_video_call", "message": json.dumps(return_data)}
                )
            
        self.call_store[conversation_id] = {}
            

    def receive_get_peer_ids(self, data):
        conversation_id = data["conversation_id"]
        call_type = data["type"]
        peer_id = data["peer_id"]
        # can not access when call type is different
        if str(self.call_store[conversation_id]["type"]) != str(call_type):
            print('diff', call_type)
            return
        
        for member in self.call_store[conversation_id]["members"]:
            if member["user_id"] == self.scope["user"].id and member["peer_id"] != peer_id:
                print('User already in call with a different peer')
                return

        # check user is in this conversation
        if not Participants.objects.filter(conversation_id=conversation_id, user=self.scope["user"]).exists():
            return

        conversation = Conversation.objects.get(id=conversation_id)
        conversation_type = conversation.type
        conversation_title = conversation.title
        conversation_image = conversation.image
        if conversation.type == Conversation.ConversationType.FRIEND:
            participant = Participants.objects.filter(conversation_id=conversation_id).exclude(user=self.scope["user"]).first()
            conversation_title = f"{participant.user.first_name} {participant.user.last_name}"
            conversation_image = participant.user.avatar
        return_data = {
            'conversation': {
                'conversation_id': conversation_id,
                'title': conversation_title,
                'image' : conversation_image,
                'type': conversation_type,
            },
            'members': self.call_store[conversation_id]["members"],
        }
        async_to_sync(self.channel_layer.group_send)(
            f"user_{self.scope['user'].id}", {"type": "return_get_peer_ids", "message": json.dumps(return_data)}
            )

    def receive_friend_request(self, event):
        self.send(text_data=json.dumps(event))

    def receive_notification(self, event):
        self.send(text_data=json.dumps(event))

    def chat_message(self, event):
        self.send(text_data=json.dumps(event))
    
    def add_group(self, event):
        self.send(text_data=json.dumps(event))
        
    def recall_message(self, event):
        self.send(text_data=json.dumps(event))
        
    def video_call(self, event):
        self.send(text_data=json.dumps(event))

    def accept_video_call(self, event):
        self.send(text_data=json.dumps(event))

    def refuse_video_call(self, event):
        self.send(text_data=json.dumps(event))
    
    def leave_video_call(self, event):
        self.send(text_data=json.dumps(event))

    def cancel_video_call(self, event):
        self.send(text_data=json.dumps(event))

    def end_video_call(self, event):
        self.send(text_data=json.dumps(event))

    def return_get_peer_ids(self, event):
        self.send(text_data=json.dumps(event))
        
    def typing_indicator(self, event):
        self.send(text_data=json.dumps(event))
        
    def pin_message(self, event):
        self.send(text_data=json.dumps(event))
    
    def change_name_conversation(self, event):
        self.send(text_data=json.dumps(event))

    def online_notification(self, event):
        self.send(text_data=json.dumps(event))
    
    def delete_member(self, event):
        self.send(text_data=json.dumps(event))