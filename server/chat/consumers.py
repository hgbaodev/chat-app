import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from .serializers import MessageSerializer
from .models import Message, Conversation, Participants, OnlineUser
from authentication.models import User
from rest_framework_simplejwt.tokens import AccessToken

class ChatConsumer(WebsocketConsumer):
    
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
        
    def receive_message_send(self, data):
        message = data["message"]
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
        
        # Get member of conversation
        # online_users = OnlineUser.objects.all()

        # participants_online = Participants.objects.filter(
        #     conversation=conversation
        # ).select_related('user').filter(user__in=online_users.values_list('user', flat=True))
        
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
        print('conversation_id', conversation_id)
        user_dict = {
            'id': self.scope["user"].id,
            'email': self.scope["user"].email,
            'full_name' : self.scope["user"].first_name + ' ' + self.scope["user"].last_name,
        }
        participants = Participants.objects.filter(conversation_id=conversation_id).exclude(user=self.scope["user"])
        for participant in participants:
            room_group_name = f"user_{participant.user.id}"
            async_to_sync(self.channel_layer.group_send)(
                room_group_name, {"type": "video_call", "message": json.dumps(user_dict)}
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