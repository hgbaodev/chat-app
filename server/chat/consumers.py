import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from .serializers import MessageSerializer, AttachmentSerializer
from .models import Message, Conversation, Participants, OnlineUser, Attachments, NameCard
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
            OnlineUser.objects.create(user=user)
            self.accept()
        else:
            self.close()

    def disconnect(self, close_code):
        OnlineUser.objects.filter(user=self.scope["user"]).delete()
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )


    def receive(self, text_data):
        data = json.loads(text_data)
        data_source = data.get('source')
        
        if data_source == "message_send":
            self.receive_message_send(data)
        elif data_source == "video_call":
            self.receive_video_call(data)
        elif data_source == "accept_video_call":
            self.receive_accept_video_call(data)
        elif data_source == "refuse_video_call":
            self.receive_refuse_video_call(data)
        elif data_source == "interrupt_video_call":
            self.receive_interrupt_video_call(data)
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
            print(room_group_name)
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

    def receive_video_call(self, data):
        conversation_id = data["conversation_id"]
        peer_id = data["peer_id"]
        # init call store
        self.call_store[conversation_id] = [peer_id]

        conversation = Conversation.objects.get(id=conversation_id)
        conversation_type = conversation.type
        conversation_title = conversation.title
        conversation_image = conversation.image
        if conversation.type == Conversation.ConversationType.FRIEND:
            participant = Participants.objects.filter(conversation_id=conversation_id).exclude(user=self.scope["user"]).first()
            conversation_title = participant.user.first_name + ' ' + participant.user.last_name
            conversation_image = participant.user.avatar
        conversation_dict = {
            'conversation_id': conversation_id,
            'title': conversation_title,
            'image' : conversation_image,
            'type': conversation_type,
        }
        message_dict = {
            'conversation': conversation_dict,
            'peer_ids': [peer_id],
        }
        participants = Participants.objects.filter(conversation_id=conversation_id).exclude(user=self.scope["user"])
        for participant in participants:
            room_group_name = f"user_{participant.user.id}"
            async_to_sync(self.channel_layer.group_send)(
                room_group_name, {"type": "video_call", "message": json.dumps(message_dict)}
                )
            
    def receive_accept_video_call(self, data):
        conversation_id = data["conversation_id"]
        peer_id = data["peer_id"]
        # return
        conversation = Conversation.objects.get(id=conversation_id)
        conversation_type = conversation.type
        conversation_title = conversation.title
        conversation_image = conversation.image
        if conversation.type == Conversation.ConversationType.FRIEND:
            participant = Participants.objects.filter(conversation_id=conversation_id).exclude(user=self.scope["user"]).first()
            conversation_title = participant.user.first_name + ' ' + participant.user.last_name
            conversation_image = participant.user.avatar
        conversation_dict = {
            'conversation_id': conversation_id,
            'title': conversation_title,
            'image' : conversation_image,
            'type': conversation_type,
        }
        return_data = {
            'peer_ids' : self.call_store[conversation_id],
            'peer_id': peer_id,
            'conversation': conversation_dict,
        }
        async_to_sync(self.channel_layer.group_send)(
            f"user_{self.scope['user'].id}", {"type": "return_accept_video_call", "message": json.dumps(return_data)}
            )
        
        
        # append peer_id into call store
        self.call_store[conversation_id].append(peer_id)

        message_dict = {
            'peer_ids': [peer_id],
        }
        participants = Participants.objects.filter(conversation_id=conversation_id).exclude(user=self.scope["user"])
        for participant in participants:
            room_group_name = f"user_{participant.user.id}"
            async_to_sync(self.channel_layer.group_send)(
                room_group_name, {"type": "accept_video_call", "message": json.dumps(message_dict)}
                )
       
    def receive_refuse_video_call(self, data):
        conversation_id = data["conversation_id"]
        participant = Participants.objects.filter(conversation_id=conversation_id).exclude(user=self.scope["user"]).first()
        room_group_name = f"user_{participant.user.id}"
        async_to_sync(self.channel_layer.group_send)(
            room_group_name, {"type": "refuse_video_call", "message": "empty"}
            )
            
    def receive_interrupt_video_call(self, data):
        conversation_id = data["conversation_id"]
        participant = Participants.objects.filter(conversation_id=conversation_id).exclude(user=self.scope["user"]).first()
        room_group_name = f"user_{participant.user.id}"
        async_to_sync(self.channel_layer.group_send)(
            room_group_name, {"type": "interrupt_video_call", "message": "empty"}
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

    def return_accept_video_call(self, event):
        self.send(text_data=json.dumps(event))
    
    def refuse_video_call(self, event):
        self.send(text_data=json.dumps(event))
    
    def interrupt_video_call(self, event):
        self.send(text_data=json.dumps(event))
        
    def typing_indicator(self, event):
        self.send(text_data=json.dumps(event))
        
    def pin_message(self, event):
        self.send(text_data=json.dumps(event))