from rest_framework import serializers
from authentication.models import User
from django.db.models import Q
from .models import FriendRequest, FriendRelationship, BlockList


class SendFriendRequestSerializer(serializers.Serializer):
    
    sender = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    receiver = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    message = serializers.CharField()

    def validate(self, data):
        sender = data['sender']
        receiver = data['receiver']

        if sender == receiver:
            raise serializers.ValidationError("Sender and receiver should be different users.")
        
        is_verified_receiver = User.objects.get(id=receiver.id)

        if not is_verified_receiver.is_verified:
            raise serializers.ValidationError("Receiver account haven't verified")
        
        existing_request = FriendRequest.objects.filter((Q(sender=sender) & Q(receiver=receiver)) | (Q(sender=receiver) & Q(receiver=sender))).first()
        if existing_request:
            raise serializers.ValidationError("Friend request already exists.")
        
        existing_relationship = FriendRelationship.objects.filter((Q(user_1=receiver) & Q(user_2=sender)) | (Q(user_1=sender) & Q(user_2=receiver))).first()
        if existing_relationship:
            raise serializers.ValidationError("You have been friends.")
        return data

    def create(self, validated_data):
        friend_request = FriendRequest.objects.create(
            sender = validated_data['sender'],
            receiver = validated_data['receiver'],
            message = validated_data['message'],
        )
        return friend_request
    
class DeleteFriendRequestSerializer(serializers.Serializer):
    
    sender = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    receiver = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    def validate(self, data):
        sender = data['sender']
        receiver = data['receiver']

        if sender == receiver:
            raise serializers.ValidationError("Sender and receiver should be different users.")
        
        existing_request = FriendRequest.objects.filter(sender=sender, receiver=receiver).first()
        if existing_request:
            existing_request.delete()
            return data
        raise serializers.ValidationError("Cannot find this friendrequest.")

class AcceptFriendRequestSerializer(serializers.Serializer):
    
    sender = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    receiver = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    def validate(self, data):
        sender = data['sender']
        receiver = data['receiver']

        if sender == receiver:
            raise serializers.ValidationError("Sender and receiver should be different users.")
        
        existing_request = FriendRequest.objects.filter(sender=sender, receiver=receiver).first()
        if existing_request:
            friend_relationship = FriendRelationship.objects.create(
                user_1=existing_request.sender,
                user_2=existing_request.receiver
            )
            existing_request.delete()
            return data
        raise serializers.ValidationError("Cannot find this friendrequest.")
    
class BlockFriendSerializer(serializers.Serializer):
    
    blocked_by = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    def validate(self, data):
        blocked_by = data['blocked_by']
        user = data['user']

        if blocked_by == user:
            raise serializers.ValidationError("blocked_by and user should be different")
        has_blocked = BlockList.objects.filter(blocked_by=blocked_by, user=user).first()
        if has_blocked:
            raise serializers.ValidationError("You have blocked this user.")

        is_friend = FriendRelationship.objects.filter((Q(user_1=blocked_by) & Q(user_2=user)) | (Q(user_1=user) & Q(user_2=blocked_by))).first()
        if is_friend:
            block_list_instance = BlockList.objects.create(
                blocked_by=blocked_by,
                user=user
            )
            return block_list_instance
        raise serializers.ValidationError("You are not friends")
    

class UnBlockFriendSerializer(serializers.Serializer):
    
    blocked_by = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    def validate(self, data):
        blocked_by = data['blocked_by']
        user = data['user']

        if blocked_by == user:
            raise serializers.ValidationError("blocked_by and user should be different")
        
        has_blocked = BlockList.objects.filter(blocked_by=blocked_by, user=user).first()
        if has_blocked:
            has_blocked.delete()
            return data
        raise serializers.ValidationError("You haven't blocked this user.") 

class DeleteFriendSerializer(serializers.Serializer):
    
    user_1 = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    user_2 = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    def validate(self, data):
        user_1 = data['user_1']
        user_2 = data['user_2']

        if user_1 == user_2:
            raise serializers.ValidationError("User1 and user2 should be different users.")
        
        existing_relationship = FriendRelationship.objects.filter((Q(user_1=user_1) & Q(user_2=user_2)) | (Q(user_1=user_2) & Q(user_2=user_1))).first()
        if existing_relationship:
            existing_relationship.delete()
            return data
        raise serializers.ValidationError(f"Cannot find this relationship between {user_1} and {user_2}.")


class GetAllFriensSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'avatar' ,'birthday' ,'about']

    @staticmethod
    def get_all_friends(user_id):

        friend_relationships = FriendRelationship.objects.filter(
            Q(user_1=user_id) | Q(user_2=user_id)
        )

        friends = []
        for relationship in friend_relationships:
            if relationship.user_1.id != user_id:
                friends.append(relationship.user_1)
            if relationship.user_2.id != user_id:
                friends.append(relationship.user_2)

        unique_friends = list(set(friends))

        return unique_friends  

class RecommendedUserSerializer(serializers.ModelSerializer):
    relationship = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'avatar' ,'birthday' ,'about', 'relationship']

    def get_relationship(self, user):
        return 0
    
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

        recommended_users = User.objects.filter(
            is_verified=True
        ).exclude(
            id__in=excluded_ids,
        )

        # limit users 

        return recommended_users  
    
class SearchUsersSerializer(serializers.ModelSerializer):
    relationship = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'avatar' ,'birthday' ,'about', 'relationship']

    def get_relationship(self, user):
        user_id = self.context['request'].user.id
        friend_requests = FriendRequest.objects.filter(
            (Q(sender=user_id) & Q(receiver=user)) | 
            (Q(receiver=user) & Q(sender=user_id))).first()
        if friend_requests: 
            return 1
        relationship = FriendRelationship.objects.filter(
            (Q(user_1=user_id) & Q(user_2=user)) | 
            (Q(user_1=user) & Q(user_2=user_id))).first()
        if relationship:
            return 2
        
        return 0
    
    @staticmethod
    def get_results(user_id, search_text):
        users = User.objects.exclude(id=user_id).filter(email__icontains=search_text)
        print(users)
        return users