from django.db import models
from authentication.models import User
# Create your models here.

class FriendRequest(models.Model):
    id = models.AutoField(primary_key=True)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_friend_requests')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_friend_requests')
    message = models.CharField(max_length=255, default='Hello!, Let\'s be friends!')
    created_at = models.DateTimeField(auto_now_add=True)


class FriendRelationship(models.Model):
    id = models.AutoField(primary_key=True)
    user_1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_1_relationship')
    user_2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_2_relationship')
    created_at = models.DateTimeField(auto_now_add=True)