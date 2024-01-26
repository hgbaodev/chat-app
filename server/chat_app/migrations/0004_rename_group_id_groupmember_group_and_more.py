# Generated by Django 5.0.1 on 2024-01-26 01:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat_app', '0003_group_groupmember'),
    ]

    operations = [
        migrations.RenameField(
            model_name='groupmember',
            old_name='group_id',
            new_name='group',
        ),
        migrations.RenameField(
            model_name='groupmember',
            old_name='user_id',
            new_name='user',
        ),
        migrations.AlterField(
            model_name='group',
            name='avatar',
            field=models.CharField(default='link_to_default_avatar', max_length=255),
        ),
    ]
