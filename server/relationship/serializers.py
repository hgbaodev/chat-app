from rest_framework import serializers
from authentication.models import User
from django.db.models import Q

from chat.serializers import ConversationSerializer
from .models import FriendRequest, FriendRelationship, BlockList
import cloudinary.api
from chat.models import Conversation, Message, Participants

class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['id',  'full_name', 'avatar']
    
    def get_full_name(self, obj):
        return obj.get_full_name
    

class GetAllFriendRequestSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    receiver = UserSerializer(read_only=True)
    class Meta:
        model = FriendRequest
        fields = '__all__'
    
    @staticmethod
    def get_all_friend_requests(user_id):
        friend_requests = friend_requests = FriendRequest.objects.filter(Q(sender=user_id) | Q(receiver=user_id))
        return friend_requests


class SendFriendRequestSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    sender = UserSerializer(read_only=True)
    receiver = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    message = serializers.CharField()
    created_at = serializers.DateTimeField(read_only=True)

    def validate(self, data):
        data['sender'] = self.context['request'].user
        return data
    
    def validate_receiver(self, value):
        sender = self.context['request'].user
        self.context['request'].data['sender'] = sender.id
        if sender == value:
            raise serializers.ValidationError('Sender and receiver should be different users.')
        is_verified_receiver = User.objects.get(id=value.id)
        if not is_verified_receiver.is_verified:
            raise serializers.ValidationError("Receiver account haven't verified")
        existing_request = FriendRequest.objects.filter((Q(sender=sender) & Q(receiver=value)) | (Q(sender=value) & Q(receiver=sender))).first()
        if existing_request:
            raise serializers.ValidationError("Friend request already exists.")
        existing_relationship = FriendRelationship.objects.filter((Q(user_1=value) & Q(user_2=sender)) | (Q(user_1=sender) & Q(user_2=value))).first()
        if existing_relationship:
            raise serializers.ValidationError("You have been friends.")
        return value

    def create(self, validated_data):
        friend_request = FriendRequest.objects.create(
            sender = validated_data['sender'],
            receiver = validated_data['receiver'],
            message = validated_data['message'],
        )
        return friend_request
    
class DeleteFriendRequestSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    def validate_id(self, value):
        user_id = self.context['request'].user
        existing_request = FriendRequest.objects.filter((Q(id=value) & Q(sender=user_id)) | (Q(id=value) & Q(receiver=user_id))).first()
        if not existing_request:
            raise serializers.ValidationError("Cannot find this friendrequest.")
        existing_request.delete()
        return value
    
class AcceptFriendRequestSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    def validate_id(self, value):
        receiver = self.context['request'].user
        existing_request = FriendRequest.objects.filter(id=value, receiver=receiver).first()
        
        if not existing_request:
            raise serializers.ValidationError("Cannot find this friendrequest.")
       
        return value
    
class BlockFriendSerializer(serializers.Serializer):
    
    blocked_by = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    def validate_user(self, value):
        blocked_by = self.context['request'].user
        if blocked_by == value:
            raise serializers.ValidationError("blocked_by and user should be different")
        has_blocked = BlockList.objects.filter(blocked_by=blocked_by, user=value).first()
        if has_blocked:
            raise serializers.ValidationError("You have blocked this user.")

        is_friend = FriendRelationship.objects.filter((Q(user_1=blocked_by) & Q(user_2=value)) | (Q(user_1=value) & Q(user_2=blocked_by))).first()
        if not is_friend:
            raise serializers.ValidationError("You are not friends")
        
        block_list_instance = BlockList.objects.create(
            blocked_by=blocked_by,
            user=value
        )
        return value
        

class UnBlockFriendSerializer(serializers.Serializer):
    
    blocked_by = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    def validate_user(self, value):
        blocked_by = self.context['request'].user
        if blocked_by == value:
            raise serializers.ValidationError("blocked_by and user should be different")
        
        has_blocked = BlockList.objects.filter(blocked_by=blocked_by, user=value).first()
        if not has_blocked:
            raise serializers.ValidationError("You haven't blocked this user.") 
        
        has_blocked.delete()
        return value
        

class DeleteFriendSerializer(serializers.Serializer):
    
    user_1 = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    user_2 = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    def validate_user_2(self, value): 
        user_1 = self.context['request'].user
        if user_1 == value:
            raise serializers.ValidationError("User1 and user2 should be different users.")
        
        existing_relationship = FriendRelationship.objects.filter((Q(user_1=user_1) & Q(user_2=value)) | (Q(user_1=value) & Q(user_2=user_1))).first()
        if not existing_relationship:
            raise serializers.ValidationError(f"Cannot find this relationship between {user_1} and {value}.")
        existing_relationship.delete()
        return value

class GetAllFriendsSerializer(serializers.ModelSerializer):
    conversation = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'avatar' ,'birthday' ,'about', 'conversation']

    @staticmethod
    def get_all_friends(user_id, query_string=None, sort='asc'):
        
        friend_relationships = FriendRelationship.objects.filter(
            Q(user_1=user_id) | Q(user_2=user_id)
        )

        friends = []
        for relationship in friend_relationships:
            if relationship.user_1.id != user_id:
                friends.append(relationship.user_1)
            if relationship.user_2.id != user_id:
                friends.append(relationship.user_2)

        if query_string:
            friends = User.objects.filter(
                Q(first_name__icontains=query_string) |
                Q(last_name__icontains=query_string),
                id__in=[friend.id for friend in friends]
            )
        else:
            friends = User.objects.filter(id__in=[friend.id for friend in friends])
            
        if sort == 'asc':
            friends = friends.order_by('last_name')
        elif sort == 'desc':
            friends = friends.order_by('-last_name')

        unique_friends = list(friends.distinct())
        return unique_friends
    
    def get_conversation(self, obj):
        user_id = self.context['request'].user.id
        conversation = Conversation.objects.filter(
            participants__user=obj.id,
            participants__conversation__type=Conversation.ConversationType.FRIEND,
            participants__conversation__participants__user=user_id).first()
        if conversation:
            serializer = ConversationSerializer(conversation, context={'request': self.context['request']})
            return serializer.data
        return None
    
class RecommendedUserSerializer(serializers.ModelSerializer):
    relationship = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'avatar' ,'birthday' ,'about', 'relationship']

    def get_relationship(self, user):
        return 0
    
    def get_full_name(self, obj):
        return obj.get_full_name
    
    @staticmethod
    def get_recommended_users(user_id):
        excluded_ids = [user_id]
        user_relationships = FriendRelationship.objects.filter(
            Q(user_1=user_id) | Q(user_2=user_id)
        ).values('user_1', 'user_2')

        for relationship in user_relationships:
            excluded_ids.append(relationship['user_1'])
            excluded_ids.append(relationship['user_2'])

        friend_requests = FriendRequest.objects.filter(
            Q(sender=user_id) | Q(receiver=user_id)
        ).values('sender', 'receiver')

        for request in friend_requests:
            excluded_ids.append(request['receiver'])
            excluded_ids.append(request['sender'])

        recommended_users = User.objects.filter(is_verified=True).exclude(id__in=excluded_ids,)

        # limit users 

        return recommended_users  
    
class SearchUsersSerializer(serializers.ModelSerializer):
    relationship = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'avatar' ,'birthday' ,'about', 'relationship']

    def get_relationship(self, user):
        user_id = self.context['request'].user.id
        friend_requests = FriendRequest.objects.filter(
            (Q(sender=user_id) & Q(receiver=user)) | 
            (Q(sender=user) & Q(receiver=user_id))).first()
        if friend_requests: 
            return 1
        relationship = FriendRelationship.objects.filter(
            (Q(user_1=user_id) & Q(user_2=user)) | 
            (Q(user_1=user) & Q(user_2=user_id))).first()
        if relationship:
            return 2
        
        return 0
    
    def get_full_name(self, obj):
        return obj.get_full_name
    
    @staticmethod
    def get_results(user_id, search_text):
        users = User.objects.exclude(id=user_id).filter(email__icontains=search_text,  is_verified=True)
        print(users)
        return users

class FriendRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendRequest
        fields = '__all__'