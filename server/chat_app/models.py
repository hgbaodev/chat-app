from django.contrib.auth.models import User
from django.db import models

# Create your models here.
from django.db.models.signals import post_save
from django.dispatch import receiver

class Profile(models.Model):
    user = models.OneToOneField(User, related_name='profile', on_delete=models.CASCADE)
    photo = models.ImageField(null=True, blank=True, default='icon_default.jpg')
    status = models.CharField(default="Hi i'm using chatapp-hgbaodev", max_length=255)
    online = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True, blank=True)


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, *args, **kwargs):
    if created:
        Profile.objects.create(user_id=instance.pk)


class Message(models.Model):
    text = models.TextField()
    sender = models.ForeignKey(User, related_name='sender', on_delete=models.CASCADE)
    receiver = models.ForeignKey(User, related_name='receiver', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True)
    
