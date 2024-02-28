from rest_framework import serializers
from authentication.models import User
from django.db.models import Q
from .models import FriendRequest, FriendRelationship, BlockList


class SendFriendRequestSerializer(serializers.Serializer):
    
    sender = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    receiver = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    message = serializers.CharField()

    def validate(self, data):
        sender_id = data['sender']
        receiver_id = data['receiver']

        if sender_id == receiver_id:
            raise serializers.ValidationError("Sender and receiver should be different users.")
        
        existing_request = FriendRequest.objects.filter((Q(sender=sender_id) & Q(receiver=receiver_id)) | (Q(sender=receiver_id) & Q(receiver=sender_id))).first()
        if existing_request:
            raise serializers.ValidationError("Friend request already exists.")
        
        existing_relationship = FriendRelationship.objects.filter((Q(user_1=receiver_id) & Q(user_2=sender_id)) | (Q(user_1=sender_id) & Q(user_2=receiver_id))).first()
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
        sender_id = data['sender']
        receiver_id = data['receiver']

        if sender_id == receiver_id:
            raise serializers.ValidationError("Sender and receiver should be different users.")
        
        existing_request = FriendRequest.objects.filter(sender=sender_id, receiver=receiver_id).first()
        if existing_request:
            existing_request.delete()
            return data
        raise serializers.ValidationError("Cannot find this friendrequest.")

class AcceptFriendRequestSerializer(serializers.Serializer):
    
    sender = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    receiver = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    def validate(self, data):
        sender_id = data['sender']
        receiver_id = data['receiver']

        if sender_id == receiver_id:
            raise serializers.ValidationError("Sender and receiver should be different users.")
        
        existing_request = FriendRequest.objects.filter(sender=sender_id, receiver=receiver_id).first()
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


class FriendSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    email = serializers.EmailField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()


