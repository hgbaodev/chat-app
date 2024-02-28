from rest_framework import serializers
from authentication.models import User
from django.db.models import Q
from .models import FriendRequest, FriendRelationship


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
