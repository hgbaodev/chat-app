from rest_framework import serializers
from authentication.models import User
from django.db.models import Q
from .models import Conversation, Message, Participants, DeleteMessage

class MemberConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','first_name', 'last_name', 'avatar'] 


class NewestMessage(serializers.ModelSerializer):
    class Meta: 
        model = Message
        fields = ['id','message','sender','message_type','created_at']

class ConversationSerializer(serializers.ModelSerializer):
    participants = serializers.ListField(child=serializers.PrimaryKeyRelatedField(queryset=User.objects.all()), allow_null=False, write_only=True)
    latest_message = NewestMessage(read_only=True)
    type = serializers.IntegerField(read_only=True)
    members = MemberConversationSerializer(many=True, read_only=True)

    class Meta:
        model = Conversation
        fields = ['id', 'title', 'image', 'type', 'latest_message', 'participants', 'members']

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



class SenderSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'avatar']

class MessageSerializer(serializers.ModelSerializer):
    sender = SenderSerializer()
    forward = serializers.SerializerMethodField()
    
    class Meta:
        model = Message
        fields = ['id', 'message', 'message_type', 'created_at', 'sender', 'conversation_id', 'forward']

    def get_forward(self, obj):
        if obj.forward:
            return MessageSerializer(obj.forward, context=self.context).data
        return None
    
class DeleteMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeleteMessage
        fields = '__all__'