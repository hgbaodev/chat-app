from rest_framework import serializers
from authentication.models import User
from relationship.models import FriendRelationship, FriendRequest
from django.db.models import Q
from relationship.serializers import FriendRequestSerializer


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
    

class UpdateProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    avatar = serializers.CharField(max_length=255, read_only=True)
    first_name = serializers.CharField(max_length=255, read_only=True)
    last_name = serializers.CharField(max_length=255, read_only=True)
    phone = serializers.CharField(max_length=20, read_only=True)
    birthday = serializers.DateField(read_only=True)
    about = serializers.CharField(max_length=255, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'full_name', 'avatar', 'phone', 'birthday', 'about'] 

    def get_full_name(self, obj):
        return obj.get_full_name
    
# Change password view (current password, new password, confirm password)
class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(max_length=255, min_length=6, required=True)
    new_password = serializers.CharField(max_length=255, min_length=6,required=True)
    confirm_password = serializers.CharField(max_length=255, min_length=6, required=True)
    
    def validate_confirm_password(self, data):
        if data != self.initial_data.get('new_password'):
            raise serializers.ValidationError("Passwords do not match.")
        return data
    
    def validate_current_password(self, data):
        request = self.context.get('request')
        if not request.user.check_password(data):
            raise serializers.ValidationError("Current password is incorrect.")
        return data
    
    
    