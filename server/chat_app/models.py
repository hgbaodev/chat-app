from django.contrib.auth.models import User
from django.db import models
from django.core.validators import RegexValidator, MinLengthValidator, MaxLengthValidator

# Create your models here.
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone

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
    
class Group(models.Model):
    group_id = models.AutoField(primary_key=True)
    group_name = models.CharField(validators=[
            RegexValidator(
                regex=r'^[a-zA-Z ]+$',
                message='groupName can only contains letter and space.',
            ),
           MinLengthValidator(limit_value=8, message='groupName must have at least 8 characters.'),
           MaxLengthValidator(limit_value=100, message='groupName can only have a maximum of 100 characters.'),
        ], max_length=100)
    avatar = models.CharField(default="group_default.png", max_length=255)
    created_by = models.ForeignKey(User, related_name='createdBy', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True)

class GroupMember(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    joined_at = models.DateTimeField(default=timezone.now)
    class Meta:
        unique_together = (('group', 'user'),)
