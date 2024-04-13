from rest_framework import serializers
from authentication.models import User
from relationship.models import FriendRelationship, FriendRequest
from django.db.models import Q

class FriendRequestSerializer(serializers.ModelSerializer):

    class Meta:
        model = FriendRequest
        fields = ['sender', 'receiver', 'message', 'created_at']

class GetInfoUserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    is_friend = serializers.SerializerMethodField(read_only=True)
    friend_request = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'full_name', 'avatar', 'phone', 'birthday', 'about', 'is_friend', 'friend_request'] 

    def get_full_name(self, obj):
        return obj.get_full_name
    
    def get_is_friend(self, obj):
        request = self.context.get('request')
        friend_relationship = FriendRelationship.objects.filter(
            Q(user_1=request.user, user_2=obj) | Q(user_1=obj, user_2=request.user)
        ).exists()
        return friend_relationship
    
    def get_friend_request(self, obj):
        request = self.context.get('request')
        friend_request = FriendRequest.objects.filter(Q(sender=obj, receiver=request.user) | Q(sender=request.user, receiver=obj))
        if friend_request.exists():
            return FriendRequestSerializer(friend_request[0]).data
        return None