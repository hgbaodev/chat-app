from django.db import models
from authentication.models import User

class Notification(models.Model):
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=255, default='System notification')
    message = models.CharField(max_length=255, default='Default message')
    seen = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    