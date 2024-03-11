from django.urls import path
from .views import ConversationList, ConversationDetail, PaticipantsList, ParicipantsDetail, GetMemberConversation, GetMessagesConversation
urlpatterns = [
    path('conversations/', ConversationList.as_view(), name='conversations'),
    path('conversations/<int:pk>/', ConversationDetail.as_view(), name='conversation-detail'),
    path('conversations/<int:pk>/participants/', GetMemberConversation.as_view(), name='get-members'),
    path('conversations/<int:pk>/messages/', GetMessagesConversation.as_view(), name='get-messages'),
    path('participants/', PaticipantsList.as_view(), name='participants'),
    path('participants/<int:pk>/', ParicipantsDetail.as_view(), name='participants-detail'),
    
]
