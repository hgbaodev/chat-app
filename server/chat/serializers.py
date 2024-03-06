from rest_framework import serializers
from authentication.models import User
from django.db.models import Q
from .models import Conversation, Message, Participants
from drf_writable_nested.serializers import WritableNestedModelSerializer

class SendMessageSerializer(serializers.ModelSerializer):
    conversation = serializers.PrimaryKeyRelatedField(queryset=Conversation.objects.all())
    sender = serializers.PrimaryKeyRelatedField(read_only=True)
    message = serializers.CharField()
    
    class Meta:
        model = Conversation
        fields = ['conversation', 'sender', 'message']
        
    def create(self, validated_data):
        sender = self.context['request'].user
        conversation = validated_data['conversation']
        message_content = validated_data['message']
        new_message = Message.objects.create(conversation=conversation, sender=sender, message=message_content)
        # send broadcast
        return new_message
    
class ConversationSerializer(serializers.ModelSerializer):
    participants = serializers.ListField(child=serializers.PrimaryKeyRelatedField(queryset=User.objects.all()), allow_null=False, write_only=True)

    class Meta:
        model = Conversation
        fields = ['id', 'title', 'image', 'participants']

    def create(self, validated_data):
        participants_data = validated_data.pop('participants')
        conversation = Conversation.objects.create(
            title=validated_data.get('title', ''),
            image=validated_data.get('image', ''),
            creator=self.context['request'].user
        )

        participants_to_create = []
        participants_to_create.append(Participants(conversation=conversation, user=self.context['request'].user))
        for member in participants_data:
            participants_to_create.append(Participants(conversation=conversation, user=member))
        
        Participants.objects.bulk_create(participants_to_create)

        return conversation

class MemberConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','first_name', 'last_name', 'avatar'] 
    
    
class CreateParticipantsSerializer(serializers.ModelSerializer):
    conversation = serializers.PrimaryKeyRelatedField(queryset=Conversation.objects.all())
    users = serializers.PrimaryKeyRelatedField(many=True,queryset=User.objects.all(), write_only=True)
    members = MemberConversationSerializer(many=True, read_only=True)
    
    class Meta:
        model = Participants
        fields = ['conversation', 'users', 'members']
    
    def validate(self, attrs):
        conversation = attrs.get('conversation')
        users = attrs.get('users')
        
        if not users:
            raise serializers.ValidationError({"user": 'Users cannot be empty.'})
        
        invalid_users = [user for user in users if Participants.objects.filter(conversation=conversation, user=user).exists()]

        if invalid_users:
            raise serializers.ValidationError({'user': 'One or more users already exist in the conversation.'})
        
        return attrs
        
    
    def create(self, validated_data):
        conversation = validated_data['conversation']
        users_data = validated_data['users']
        participants_list = []

        for user in users_data:
            participant = Participants.objects.create(conversation=conversation, user=user)
            participants_list.append(participant)
        
        members = User.objects.filter(participants__in=participants_list)
        
        return {
            'conversation': conversation,
            'members': members.values()
        }

class ParticipantDetailSerializer(serializers.ModelSerializer):
    id = serializers.PrimaryKeyRelatedField(source='pk', read_only=True)
    class Meta:
        model = Participants
        fields = ['id','title']