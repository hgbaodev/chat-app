from rest_framework import serializers
from .models import User, UserVerification
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_str, smart_bytes
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from .utils import send_normal_email
from .helpers import Google, register_social_user
from .github import Github
from django.conf import settings

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=68, min_length=6, write_only=True)
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'password']
    
    def create(self, validated_data):
        user = User.objects.create_user(
            email = validated_data['email'],
            first_name = validated_data['first_name'],
            last_name = validated_data['last_name'],
            password = validated_data['password']
        )
        
        return user
    
class VerifyUserEmailSerializer(serializers.Serializer):
    otp = serializers.CharField()
    
    def validate_otp(self, value):
        if not value:
            raise serializers.ValidationError("Passcode not provided")
        try:
            user_code_obj = UserVerification.objects.get(otp=value)
        except UserVerification.DoesNotExist:
            raise serializers.ValidationError("Passcode is invalid")

        if user_code_obj.user.is_verified:
            raise serializers.ValidationError("User is already verified")
        return value
    
class LoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=255)
    password = serializers.CharField(max_length=68, min_length=6, write_only=True)
    full_name = serializers.CharField(max_length=255, read_only=True)
    access_token = serializers.CharField(max_length=255, read_only=True)
    refresh_token = serializers.CharField(max_length=255, read_only=True)
    avatar = serializers.CharField(max_length=255, read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'email', 'password', 'full_name', 'avatar', 'access_token', 'refresh_token']
    
    def validate(self, attrs):
        
        email = attrs.get('email')
        password = attrs.get('password')
        request = self.context.get('request')
        user = authenticate(request,email=email, password=password)
        if not user:
            raise AuthenticationFailed("Invalid credentials try again")
        
        if not user.is_verified:
            raise AuthenticationFailed("Email is not verified")
        
        tokens = user.tokens()
        return {
            'id': user.id,
            'email': user.email,
            'full_name': user.get_full_name,
            'avatar': user.avatar,
            'access_token': str(tokens.get('access')),
            'refresh_token': str(tokens.get('refresh')),
        }

    
class LogoutUserSerializer(serializers.Serializer):
    refresh_token=serializers.CharField()

    default_error_message = {
        'bad_token': ('Token is expired or invalid')
    }

    def validate(self, attrs):
        self.token = attrs.get('refresh_token')

        return attrs

    def save(self, **kwargs):
        try:
            token=RefreshToken(self.token)
            token.blacklist()
        except TokenError:
            return self.fail('bad_token')


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255)

    class Meta:
        fields = ['email']

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("User with that email does not exist")
        return value

    def validate(self, attrs):
        attrs = super().validate(attrs)
        email = attrs.get('email')
        user = User.objects.get(email=email)
        uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
        token = PasswordResetTokenGenerator().make_token(user)
        request = self.context.get('request')
        current_site = get_current_site(request).domain
        relative_link = reverse('reset-password-confirm', kwargs={'uidb64': uidb64, 'token': token})
        abslink = f"http://{current_site}{relative_link}"
        email_body = f"Hi {user.first_name}, use the link below to reset your password: {abslink}"
        data = {
            'email_body': email_body, 
            'email_subject': "Reset your Password", 
            'to_email': user.email
        }
        send_normal_email(data)
        
        return attrs

    
class SetNewPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(max_length=100, min_length=6, write_only=True)
    uidb64 = serializers.CharField(min_length=1, write_only=True)
    token = serializers.CharField(min_length=3, write_only=True)

    class Meta:
        fields = ['password', 'uidb64', 'token']

    def validate(self, attrs):
        try:
            token=attrs.get('token')
            uidb64=attrs.get('uidb64')
            password=attrs.get('password')

            user_id=force_str(urlsafe_base64_decode(uidb64))
            user=User.objects.get(id=user_id)
            if not PasswordResetTokenGenerator().check_token(user, token):
                raise AuthenticationFailed("Reset link is invalid or has expired", 401)
            user.set_password(password)
            user.save()
            return user
        except Exception as e:
            return AuthenticationFailed("Link is invalid or has expired")


class UserSerializer(serializers.ModelSerializer):
    email = serializers.CharField(max_length=255, read_only=True)
    full_name = serializers.SerializerMethodField()
    avatar = serializers.CharField(max_length=255, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'avatar'] 

    def get_full_name(self, obj):
        return obj.get_full_name


class GetInfoUserSerializer(serializers.ModelSerializer):
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

class GoogleSignInSerializer(serializers.Serializer):
    access_token = serializers.CharField(min_length=6)
    def validate_access_token(self, access_token):
        user_data = Google.validate(access_token)
        try:
            user_data['sub']
        except:
            raise serializers.ValidationError("This token has expired or is invalid. Please try again.")
        if user_data['aud'] != settings.GOOGLE_CLIENT_ID:
            raise AuthenticationFailed('Could not verify user.')
        email = user_data['email']
        name = user_data['name']
        name_parts = name.split() 
        first_name = ' '.join(name_parts[:-1]) 
        last_name = name_parts[-1]
        avatar = user_data['picture']
        return register_social_user(email, first_name, last_name, avatar)
    def to_representation(self, instance):
        return instance

class GithubLoginSerializer(serializers.Serializer):
    code = serializers.CharField()

    def validate_code(self, code):   
        access_token = Github.exchange_code_for_token(code)
        if access_token:
            user_data=Github.get_github_user(access_token)
            full_name=user_data['name']
            email=user_data['login']+"@gmail.com"
            names=full_name.split(" ")
            first_name = ' '.join(names[:-1]) 
            last_name = names[-1]
            avatar = user_data['avatar_url']
            return register_social_user(email, first_name, last_name, avatar)
        else: 
            return {'error': 'Invalid access token'}
