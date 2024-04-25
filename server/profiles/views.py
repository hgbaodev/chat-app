from django.shortcuts import render
from .serializers import GetInfoUserSerializer, UpdateProfileSerializer
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from authentication.models import User
import base64
import secrets
import cloudinary.uploader
from utils.responses import SuccessResponse, ErrorResponse
from rest_framework.generics import GenericAPIView

# Create your views here.
class GetUserView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get_object(self, pk):
        try:
            return User.objects.get(pk=pk)
        except User.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        snippet = self.get_object(pk)
        serializer = GetInfoUserSerializer(snippet, context={'request': request})
        return Response(serializer.data)
    
class UpdateProfileView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UpdateProfileSerializer
    def post(self, request):
        try:
            user_data = request.data
            image_file = user_data.get('image')
            user_id = request.user.id
            user = User.objects.get(id=user_id)
            if image_file is not None:
                decoded_file = base64.b64decode(image_file.split(",")[1])
                file_name = f"{secrets.token_hex(8)}"
                upload_result = cloudinary.uploader.upload(decoded_file,public_id=file_name,resource_type="auto")
                user.avatar = upload_result['secure_url']
            user.first_name = user_data.get('first_name')
            user.last_name = user_data.get('last_name')
            user.email = user_data.get('email')
            user.phone = user_data.get('phone')
            user.about = user_data.get('about')
            if 'birthday' in user_data and isinstance(user_data['birthday'], str):
                user.birthday = user_data.get('birthday')
            user.save()
            serializer = self.serializer_class(user)
            return SuccessResponse(data=serializer.data)
        except Exception as e:
            print("Error uploading image:", e)
            return ErrorResponse(error_message=str(e))
