# Generated by Django 5.0.1 on 2024-03-05 09:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0003_remove_conversation_chanel_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='participants',
            name='conversation_title',
            field=models.CharField(blank=True, max_length=255),
        ),
    ]