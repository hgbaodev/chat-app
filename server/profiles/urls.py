from django.urls import path
from .views import GetUserView, UpdateProfileView,ChangePasswordView

urlpatterns = [
    path('<str:pk>/', GetUserView.as_view(), name='get-user-info'),
    path('upload-profile', UpdateProfileView.as_view(), name='update-profile'),
    path('change-password', ChangePasswordView.as_view(), name='change-password'),
]
