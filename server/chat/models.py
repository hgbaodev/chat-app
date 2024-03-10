from django.db import models
from enum import IntEnum
from authentication.models import User

class OnlineUser(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    def __str__(self) -> str:
        return f"{self.user.first_name} {self.user.last_name}"

class Conversation(models.Model): #tạo, xoá, update
    title = models.CharField(max_length=255)
    image = models.CharField(max_length=255, blank=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
class Participants(models.Model): #tham gia, out
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
class Message(models.Model): # gửi, xoá
    class MessageType(IntEnum):
        TEXT = 1
        IMAGE = 2
        VIDEO = 3
        VOICE = 4
        PDF = 5
        
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE)
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    message_type = models.IntegerField(choices=[(tag.value, tag.name) for tag in MessageType], default=MessageType.TEXT)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self) -> str:
        return f"{self.conversation_id}:{self.message_type}:{self.created_at}:{self.message}"