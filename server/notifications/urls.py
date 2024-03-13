from django.urls import path
from .views import GetNumberOfUnseenNotificationsView
urlpatterns = [
    path('unseen/count', GetNumberOfUnseenNotificationsView.as_view(), name='count-unseen'),
]
