import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from .serializers import MessageSerializer
from .models import Message, Conversation, Participants, OnlineUser, OnlineUser
from django.db.models import Q

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        user_id = self.scope["user"].id
        if user_id is not None:
            self.room_name = user_id
            self.room_group_name = f"user_{self.room_name}"
            async_to_sync(self.channel_layer.group_add)(
                self.room_group_name, self.channel_name
            )
            OnlineUser.objects.create(user=self.scope["user"])
            print(self.scope["user"])
            self.accept()
        else:
            self.close()

    def disconnect(self, close_code):
        OnlineUser.objects.get(user=self.scope["user"]).delete()
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )

    def receive(self, text_data):
        data = json.loads(text_data)
        data_source = data.get('source')
        
        if data_source == "message_send":
            self.receive_message_send(data)
        
    def receive_message_send(self, data):
        message = data["message"]
        message_type = data.get("message_type", Message.MessageType.TEXT)
        conversation_id = data["conversation_id"]
        sender = self.scope["user"]
        conversation = Conversation.objects.get(id=conversation_id)
        
        # Create message
        message = Message.objects.create(
            conversation=conversation,
            sender=sender,
            message=message,
            message_type=message_type
        )
        
        # Get member of conversation
        online_users = OnlineUser.objects.all()
        participants_online = Participants.objects.filter(
            conversation=conversation
        ).select_related('user').filter(user__in=online_users.values_list('user', flat=True))
        
        message_serializer = MessageSerializer(instance=message)
        for participant in participants_online:
            async_to_sync(self.channel_layer.group_send)(
                f"user_{participant.user.pk}", {"type": "chat.message", "message": message_serializer.data}
            )

    def chat_message(self, event):
        message = event["message"]

        # Send message to WebSocket
        self.send(text_data=json.dumps(message))

    def send_friend_request(self, event):
        message = event['message']
        self.send(text_data=json.dumps({
            'message': message,
        }))