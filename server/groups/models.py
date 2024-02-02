from django.db import models
from django.core.validators import RegexValidator, MinLengthValidator, MaxLengthValidator

from django.contrib.auth.models import User
from django.utils import timezone

# Create your models here.
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
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True)



# class GroupMember(models.Model):
#     group = models.ForeignKey(Group, on_delete=models.CASCADE)
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     joined_at = models.DateTimeField(default=timezone.now)
#     class Meta:
#         unique_together = (('group', 'user'),)
