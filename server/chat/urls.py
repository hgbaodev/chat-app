from django.urls import path
from .views import SendMessageView,ConversationList, ConversationDetail, PaticipantsList, ParicipantsDetail, GetMemberConversation

urlpatterns = [
    path('messages/', SendMessageView.as_view(), name='messages'),
    path('conversations/', ConversationList.as_view(), name='conversations'),
    path('conversations/<int:pk>/', ConversationDetail.as_view(), name='conversation-detail'),
    path('conversations/<int:pk>/participants/', GetMemberConversation.as_view(), name='get-member'),
    path('participants/', PaticipantsList.as_view(), name='participants'),
    path('participants/<int:pk>/', ParicipantsDetail.as_view(), name='participants-detail'),
    
]