from django.urls import path
from .views import SendFriendRequestView, CancelFriendRequestView, RefuseFriendRequestView, AcceptFriendRequestView, DeleteFriendView

urlpatterns = [
    path('send-friend-request', SendFriendRequestView.as_view(), name='send-friend-request'),
    path('cancel-friend-request/<int:receiver>', CancelFriendRequestView.as_view(), name='cancel-friend-request'),
    path('refuse-friend-request/<int:sender>', RefuseFriendRequestView.as_view(), name='refuse-friend-request'),
    path('accept-friend-request/<int:sender>', AcceptFriendRequestView.as_view(), name='accept-friend-request'),
    path('delete-friend/<int:friend_id>', DeleteFriendView.as_view(), name='delete-friend'),
]