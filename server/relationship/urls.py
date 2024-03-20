from django.urls import path
from .views import ( ManageFriendRequestView, DeleteFriendView, GetAllFriendsView, 
                    BlockUnblockFriendView, GetRecommendedUserView, 
                    SearchUsersView, FriendRequestsView, GetNumberOfReceiveFriendRequestsView)

urlpatterns = [
    path('friend-requests', FriendRequestsView.as_view(), name='friend-requests'),
    path('friend-requests/receive-friend-requests/count', GetNumberOfReceiveFriendRequestsView.as_view(), name='count-receive-friend-requests'),
    path('friend-requests/<int:friend_request_id>', ManageFriendRequestView.as_view(), name='manage-friend-request'),

    path('friends/', GetAllFriendsView.as_view(), name='get-all-friends'),
    path('friends/<int:friend_id>', DeleteFriendView.as_view(), name='delete-friend'),
    path('friends/block/<int:friend_id>', BlockUnblockFriendView.as_view(), name='block-friend'),

    path('get-recommended-users', GetRecommendedUserView.as_view(), name='get-recommeded-users'),
    path('search-users/<str:search_text>', SearchUsersView.as_view(), name='search-users'),
   
]