from django.urls import path
from .views import GetNumberOfUnseenNotificationsView, GetAllNotificationsView
urlpatterns = [
    path('', GetAllNotificationsView.as_view(), name='get-all'),
    path('unseen/count', GetNumberOfUnseenNotificationsView.as_view(), name='count-unseen'),
]
