from rest_framework import serializers
from authentication.models import User
from .models import FriendRequest


class SendFriendRequestSerializer(serializers.Serializer):
    
    sender = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    receiver = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    message = serializers.CharField()

    def validate(self, data):
        sender_id = data['sender']
        receiver_id = data['receiver']

        if sender_id == receiver_id:
            raise serializers.ValidationError("Sender and receiver should be different users.")
        
        existing_my_request = FriendRequest.objects.filter(sender=sender_id, receiver=receiver_id).first()
        if existing_my_request:
            raise serializers.ValidationError("FriendRequest already exists for the given sender and receiver.")
        
        existing_request = FriendRequest.objects.filter(sender=receiver_id, receiver=sender_id).first()
        if existing_request:
            raise serializers.ValidationError("FriendRequest already exists, accept now")
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
