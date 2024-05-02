from django.urls import path
from .views import GetNumberOfUnseenNotificationsView, GetAllNotificationsView, MarkAllNotificationsAsSeenView
urlpatterns = [
    path('', GetAllNotificationsView.as_view(), name='get-all'),
    path('unseen/count', GetNumberOfUnseenNotificationsView.as_view(), name='count-unseen'),
    path('mark-all-as-seen', MarkAllNotificationsAsSeenView.as_view(), name='mark-as-seen')
]
