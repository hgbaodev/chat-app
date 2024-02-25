from django.urls import path
from .views import RegisterUserView, VerifyUserEmail, LoginUserView, LogoutView, PasswordResetRequestView, PasswordResetConfirm, SetNewPasswordView, TestingAuthenticatedReq
from rest_framework_simplejwt.views import (TokenRefreshView)

urlpatterns = [
    path('register', RegisterUserView.as_view(), name='register'),
    path('verify-email', VerifyUserEmail.as_view(), name='verify'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('login', LoginUserView.as_view(), name='login'),
    path('logout', LogoutView.as_view(), name='logout'),
    path('password-reset', PasswordResetRequestView.as_view(), name='password-reset'),
    path('password-reset-confirm/<uidb64>/<token>', PasswordResetConfirm.as_view(), name='reset-password-confirm'),
    path('set-new-password', SetNewPasswordView.as_view(), name='set-new-password'),
    path('get-something', TestingAuthenticatedReq.as_view(), name='just-for-testing'),
]