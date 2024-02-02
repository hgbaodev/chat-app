# group api here
from django.urls import path

from .views import GetAllGroups, CreateGroup

urlpatterns = [
    path('<int:user_id>', GetAllGroups.as_view()),
    path('create-group', CreateGroup.as_view()),
]
    