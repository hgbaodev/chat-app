# Generated by Django 5.0.1 on 2024-03-05 09:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0004_participants_conversation_title'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='participants',
            name='conversation_title',
        ),
    ]
