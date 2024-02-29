from rest_framework import serializers
from .models import User, OneTimePassword
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_str, force_str, smart_bytes
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from .utils import send_normal_email

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
            user_code_obj = OneTimePassword.objects.get(otp=value)
        except OneTimePassword.DoesNotExist:
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
    
    class Meta:
        model = User
        fields = ['email', 'password', 'full_name', 'access_token', 'refresh_token']
    
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
            'email': user.email,
            'full_name': user.get_full_name,
            'access_token': str(tokens.get('access')),
            'refresh_token': str(tokens.get('refresh'))
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
