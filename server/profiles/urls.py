from django.urls import path
from .views import GetUserView

urlpatterns = [
    path('profile/<str:pk>/', GetUserView.as_view(), name='get-user-info'),
]
