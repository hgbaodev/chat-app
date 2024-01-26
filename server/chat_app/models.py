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


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, *args, **kwargs):
    if created:
        Profile.objects.create(user_id=instance.pk)


class Message(models.Model):
    text = models.TextField()
    date_time = models.DateTimeField(auto_now_add=True, blank=True)
    sender = models.ForeignKey(User, related_name='sender', on_delete=models.CASCADE)
    receiver = models.ForeignKey(User, related_name='receiver', on_delete=models.CASCADE)
    
class Group(models.Model):
    id = models.AutoField(primary_key=True)
    groupName = models.CharField(validators=[
            RegexValidator(
                regex=r'^[a-zA-Z ]+$',
                message='groupName can only contains letter and space.',
            ),
           MinLengthValidator(limit_value=8, message='groupName must have at least 8 characters.'),
           MaxLengthValidator(limit_value=100, message='groupName can only have a maximum of 100 characters.'),
        ], max_length=100)
    avatar = models.CharField(default="link_to_default_avatar", max_length=255)
    createdBy = models.ForeignKey(User, related_name='createdBy', on_delete=models.CASCADE)
    createdAt = models.DateTimeField(default=timezone.now)

class GroupMember(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    joineddAt = models.DateTimeField(default=timezone.now)
    class Meta:
        unique_together = (('group', 'user'),)
