from rest_framework.generics import GenericAPIView
from .serializers import RegisterSerializer, LoginSerializer, VerifyUserEmailSerializer
from rest_framework.response import Response
from rest_framework import status
from .models import OneTimePassword
from .utils import send_generated_otp_to_email

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
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class VerifyUserEmail(GenericAPIView):
    serializer_class = VerifyUserEmailSerializer
    def post(self, request):
        passcode = request.data.get('otp')
        try:
            user_code_obj = OneTimePassword.objects.get(otp=passcode)
            user = user_code_obj.user
            if not user.is_verified:
                user.is_verified = True
                user_code_obj.delete()
                user.save()
                return Response({
                    'message': 'Account email verified successfully'
                }, status=status.HTTP_200_OK)
            return Response({'message':'Passcode is invalid user is already verified'}, status=status.HTTP_204_NO_CONTENT)
        # Bắt lỗi khi không tìm thấy otp trong csdl
        except OneTimePassword.DoesNotExist as identifier:
            return Response({'message':'passcode not provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        