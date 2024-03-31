from rest_framework.generics import GenericAPIView
from .serializers import GetInfoUserSerializer, RegisterSerializer, LoginSerializer, VerifyUserEmailSerializer, LogoutUserSerializer, SetNewPasswordSerializer, PasswordResetRequestSerializer, UserSerializer
from rest_framework.response import Response
from rest_framework import status
from .models import UserVerification
from .utils import send_generated_otp_to_email
from rest_framework.permissions import IsAuthenticated
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import smart_str, DjangoUnicodeDecodeError
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from rest_framework.permissions import IsAuthenticated
from .models import User
from utils.responses import SuccessResponse, ErrorResponse
import base64
import secrets
import cloudinary.uploader

class RegisterUserView(GenericAPIView):
    serializer_class = RegisterSerializer
    
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            user = serializer.data
            send_generated_otp_to_email(user['email'], request)
            return Response({
                'data': user,
                'message': 'User created successfully'
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginUserView(GenericAPIView):
    serializer_class = LoginSerializer
    
    def post(self, request):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        return SuccessResponse(serializer.data)
    
class VerifyUserEmail(GenericAPIView):
    serializer_class = VerifyUserEmailSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        passcode = serializer.validated_data.get('otp')

        user_code_obj = UserVerification.objects.get(otp=passcode)
        user = user_code_obj.user
        user.is_verified = True
        user_code_obj.delete()
        user.save()

        return Response({'message': 'Account email verified successfully'}, status=status.HTTP_200_OK)
        
class LogoutView(GenericAPIView):
    serializer_class = LogoutUserSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer=self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    
class PasswordResetRequestView(GenericAPIView):
    serializer_class=PasswordResetRequestSerializer

    def post(self, request):
        serializer=self.serializer_class(data=request.data, context={'request':request})
        serializer.is_valid(raise_exception=True)
        return Response({'message':'We have sent you a link to reset your password'}, status=status.HTTP_200_OK)
    

class PasswordResetConfirm(GenericAPIView):
    def get(self, request, uidb64, token):
        try:
            user_id=smart_str(urlsafe_base64_decode(uidb64))
            user=User.objects.get(id=user_id)

            if not PasswordResetTokenGenerator().check_token(user, token):
                return Response({'message':'Token is invalid or has expired'}, status=status.HTTP_401_UNAUTHORIZED)
            return Response({'success':True, 'message':'Credentials is valid', 'uidb64':uidb64, 'token':token}, status=status.HTTP_200_OK)

        except DjangoUnicodeDecodeError as identifier:
            return Response({'message':'Token is invalid or has expired'}, status=status.HTTP_401_UNAUTHORIZED)

class SetNewPasswordView(GenericAPIView):
    serializer_class=SetNewPasswordSerializer

    def patch(self, request):
        serializer=self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({'success':True, 'message':"Password reset is succesful"}, status=status.HTTP_200_OK)

 # Các trường bạn muốn trả về 
    
class GetAuthenticatedReqView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    def get(self, request):
        user_id = request.user.id
        user = User.objects.get(id=user_id)
        serializer = self.serializer_class(user)
        return SuccessResponse(data=serializer.data)

class GetInforUserView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = GetInfoUserSerializer

    def get(self, request):
        user_id = request.user.id
        user = User.objects.get(id=user_id)
        serializer = self.serializer_class(user)
        return SuccessResponse(data=serializer.data)

class UpdateProfileView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = GetInfoUserSerializer
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
