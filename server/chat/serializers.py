from rest_framework import serializers
from authentication.models import User
from django.db.models import Q
from .models import Conversation, Message, Participants, DeleteMessage, Attachments, PinConversation, PinnedMessages
from django.shortcuts import get_object_or_404

class MemberConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','first_name', 'last_name', 'avatar', 'about'] 

class SenderSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'avatar']
class NewestMessage(serializers.ModelSerializer):
    sender = SenderSerializer()
    class Meta: 
        model = Message
        fields = ['id','message','sender','message_type','created_at']

class ConversationSerializer(serializers.ModelSerializer):
    participants = serializers.ListField(child=serializers.PrimaryKeyRelatedField(queryset=User.objects.all()), allow_null=False, write_only=True)
    latest_message = NewestMessage(read_only=True)
    type = serializers.IntegerField(read_only=True)
    members = MemberConversationSerializer(many=True, read_only=True)
    is_pinned = serializers.BooleanField(read_only=True)

    class Meta:
        model = Conversation
        fields = ['id', 'title', 'image', 'type', 'latest_message', 'participants', 'members', 'is_pinned']

    def create(self, validated_data):
        participants_data = validated_data.pop('participants')
        conversation = Conversation.objects.create(
            title=validated_data.get('title', ''),
            creator=self.context['request'].user
        )

        participants_to_create = []
        participants_to_create.append(Participants(conversation=conversation, user=self.context['request'].user))
        for member in participants_data:
            participants_to_create.append(Participants(conversation=conversation, user=member))
        
        Participants.objects.bulk_create(participants_to_create)

        return conversation
    

    
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

class AttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attachments
        fields = '__all__'

class MessageSerializer(serializers.ModelSerializer):
    sender = SenderSerializer()
    forward = serializers.SerializerMethodField()
    attachments = serializers.SerializerMethodField()
    
    class Meta:
        model = Message
        fields = ['id', 'message', 'message_type', 'created_at', 'sender', 'conversation_id', 'forward', 'attachments', 'is_pinned']

    def get_forward(self, obj):
        if obj.forward:
            return MessageSerializer(obj.forward, context=self.context).data
        return None
    
    def get_attachments(self, obj):
        attachments = Attachments.objects.filter(message=obj)
        return AttachmentSerializer(attachments, many=True).data
    
class DeleteMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeleteMessage
        fields = '__all__'


class PinConversationSerializer(serializers.ModelSerializer):
    conversation_id = serializers.IntegerField()

    def validate_conversation_id(self, value):
        try:
            conversation = Conversation.objects.get(id=value)
        except Conversation.DoesNotExist:
            raise serializers.ValidationError("Conversation does not exist")
        return value

    class Meta:
        model = PinConversation
        fields = ['id', 'user', 'conversation', 'created_at', 'conversation_id']
        extra_kwargs = {
            'user': {'required': False},
            'conversation': {'required': False}
        }

class CloseConversationSerializer(serializers.ModelSerializer):
    conversation_id = serializers.IntegerField()

    def validate(self, data):
        user = self.context['request'].user
        conversation_id = data.get('conversation_id')

        try:
            participant = Participants.objects.get(conversation_id=conversation_id, user=user)
        except Participants.DoesNotExist:
            raise serializers.ValidationError("Conversation does not exist for this user")

        return data

    class Meta:
        model = Participants
        fields = ['id', 'user', 'conversation', 'created_at', 'conversation_id']
        extra_kwargs = {
            'user': {'required': False},
            'conversation': {'required': False}
        }

class PinnedMessagesCreateSerializer(serializers.Serializer):
    message_id = serializers.IntegerField(write_only=True)

    def create(self, validated_data):
        request = self.context.get('request')
        pk = self.context.get('pk')
        user = request.user
        conversation = get_object_or_404(Conversation, pk=pk)

        return PinnedMessages.objects.create(
            message_id=validated_data['message_id'],
            pinned_by=user,
            conversation=conversation
        )