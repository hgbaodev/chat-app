import requests
from google.auth.transport import requests
from google.oauth2 import id_token
from .models import User
from django.contrib.auth import authenticate
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken

class Google():
    @staticmethod
    def validate(access_token):
        try:
            id_info=id_token.verify_oauth2_token(access_token, requests.Request())
            if 'accounts.google.com' in id_info['iss']:
                return id_info
        except:
            return "the token is either invalid or has expired"

def register_social_user(email, first_name, last_name):
    old_user=User.objects.filter(email=email).first()
    if old_user:
        refresh = RefreshToken.for_user(old_user)
        return {
            'id': old_user.id,
            'full_name':old_user.first_name + ' ' + old_user.last_name,
            'email':old_user.email,
            'avatar': old_user.avatar,
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh),
        }
    else:
        new_user={
            'email':email,
            'first_name':first_name,
            'last_name':last_name,
            'password':settings.SOCIAL_AUTH_PASSWORD
        }
        user=User.objects.create_user(**new_user)
        user.is_verified=True
        user.save()
        login_user=authenticate(email=email, password=settings.SOCIAL_AUTH_PASSWORD)
        tokens=login_user.tokens()
        return {
            'id': login_user.id,
            'email':login_user.email,
            'full_name':login_user.get_full_name,
            'avatar': login_user.avatar,
            "access_token":str(tokens.get('access')),
            "refresh_token": ''
        }
