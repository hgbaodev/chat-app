from django.urls import path
from .views import DeletePinnedMessage, PinnedMessagesList, GetAttachmentConversation, ConversationList, ConversationDetail, PaticipantsList, ParicipantsDetail, MesssageDetail, GetMemberConversation, GetMessagesConversation, ConversationListFind, PinConversationUser, UnpinConversationUser, LeaveConversation, ChangeNameConversation

urlpatterns = [
    path('conversations/', ConversationList.as_view(), name='conversations'),
    path('find-conversations/', ConversationListFind.as_view(), name='find-conversations'),
    path('conversations/<int:pk>/', ConversationDetail.as_view(), name='conversation-detail'),
    path('conversations/<int:pk>/participants/', GetMemberConversation.as_view(), name='get-members'),
    path('conversations/<int:pk>/attachments/', GetAttachmentConversation.as_view(), name='get-attachments'),
    path('conversations/<int:pk>/messages/', GetMessagesConversation.as_view(), name='get-messages'),
    path('conversations/<int:pk>/pinned/', PinnedMessagesList.as_view(), name='get-pinned-messages'),
    path('conversations/<int:pk>/pinned/<int:message_id>', DeletePinnedMessage.as_view(), name='delete-pinned-messages'),
    path('participants/', PaticipantsList.as_view(), name='participants'),
    path('participants/<int:pk>/', ParicipantsDetail.as_view(), name='participants-detail'),
    path('messages/<int:pk>/', MesssageDetail.as_view(), name='message-detail'),
    path('pin-conversation/', PinConversationUser.as_view(), name='pin-conversation'),
    path('unpin-conversation/', UnpinConversationUser.as_view(), name='unpin-conversation'),
    path('leave-conversation/', LeaveConversation.as_view(), name='leave-conversation'),
    path('change-name-conversation/', ChangeNameConversation.as_view(), name='change-name-conversation'),
]
