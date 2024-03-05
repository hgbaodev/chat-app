from django.db import models
from authentication.models import User

class FriendRequest(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_friend_requests')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_friend_requests')
    message = models.CharField(max_length=255, default='Hello!, Let\'s be friends!')
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        unique_together = ('sender', 'receiver')

class FriendRelationship(models.Model):
    user_1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_1_relationship')
    user_2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_2_relationship')
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        unique_together = ('user_1', 'user_2')

class BlockList(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_id')
    blocked_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_id_blocked')
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        unique_together = ('user', 'blocked_by')