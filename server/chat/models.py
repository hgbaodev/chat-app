from django.db import models
from enum import IntEnum
from authentication.models import User

class OnlineUser(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    def __str__(self) -> str:
        return f"{self.user.first_name} {self.user.last_name}"

class Conversation(models.Model):
    class ConversationType(IntEnum):
        GROUP = 1
        FRIEND = 2

    title = models.CharField(max_length=255, blank=True)
    image = models.CharField(max_length=255, default="07adfb1c92adb6b369b44cf6f1734a52")
    creator = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    type = models.IntegerField(choices=[(tag.value, tag.name) for tag in ConversationType], default=ConversationType.GROUP)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
class Participants(models.Model): #tham gia, out
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self) -> str:
        return f" id: {self.pk} | ConversationID: {self.conversation.pk} |User: {self.user}"
    
class Message(models.Model): # gửi, xoá
    class MessageType(IntEnum):
        TEXT = 1
        IMAGE = 2
        VIDEO = 3
        AUDIO = 4
        FILE = 5
        RECALL = 6
        
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE)
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    message_type = models.IntegerField(choices=[(tag.value, tag.name) for tag in MessageType], default=MessageType.TEXT)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self) -> str:
        return f"{self.conversation_id}:{self.message_type}:{self.created_at}:{self.message}"
    
class DeleteMessage(models.Model):
    message = models.ForeignKey(Message, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)