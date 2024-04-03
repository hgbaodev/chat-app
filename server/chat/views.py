from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics
from .serializers import PinnedMessagesSerializer,PinnedMessagesCreateSerializer, AttachmentSerializer,MemberConversationSerializer, ParticipantDetailSerializer,DeleteMessageSerializer, ConversationSerializer, CreateParticipantsSerializer,MessageSerializer, PinConversationSerializer, CloseConversationSerializer
from rest_framework.permissions import IsAuthenticated
from .models import Conversation, Participants, Message, DeleteMessage, PinConversation, Attachments, PinnedMessages
from django.http import Http404
from django.db.models import Max
from config.paginations import CustomPagination
from django.db.models import Max
from utils.responses import SuccessResponse, ErrorResponse
from django.db.models import Q
from authentication.models import User
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.utils import timezone


def send_message_to_conversation_members(conversation_id, type, data):
    channel_layer = get_channel_layer()
    users = User.objects.filter(participants__conversation_id=conversation_id)
    for user in users:
        room_group_name = f"user_{user.id}"
        async_to_sync(channel_layer.group_send)(
            room_group_name,
            {
                'type': type,
                'message': data
            }
        )

class ConversationList(APIView):
    serializer_class = ConversationSerializer
    pagination_class = CustomPagination
    permission_classes = [IsAuthenticated]

    def get(self, request):
        conversations = Conversation.objects.filter(participants__user=request.user).annotate(
            latest_message_time=Max('message__created_at')
        ).order_by('-latest_message_time')

        paginator = self.pagination_class()
        result_page = paginator.paginate_queryset(conversations, request)
        
        conversation_data = []
        for conversation in result_page:
            is_pinned = PinConversation.objects.filter(user=request.user, conversation=conversation).exists()
            users = User.objects.filter(participants__conversation=conversation)
            latest_message = Message.objects.filter(conversation=conversation).order_by('-created_at').first()
            if latest_message is not None:
                conversation_data.append({
                    'id': conversation.id,
                    'title': conversation.title,
                    'image': conversation.image,
                    'latest_message': latest_message,
                    'type': conversation.type,
                    'members': users,
                    'is_pinned': is_pinned
                })
        
        serializer = self.serializer_class(conversation_data, many=True)
        return paginator.get_paginated_response(serializer.data)

    # Tạo cuộc hội thoại
    def post(self, request):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            conversation = Conversation.objects.get(id=serializer.data['id'])
            sender = self.request.user
            users = User.objects.filter(participants__conversation=conversation)
            message = Message.objects.create(
                conversation=conversation,
                sender=sender,
                message="Tôi đã tạo ra group này!",
                message_type=Message.MessageType.INIT_CONVERSATION
            )
            members_info = [
                {
                    'id': member['id'],
                    'first_name': member['first_name'],
                    'last_name': member['last_name'],
                    'avatar': member['avatar']
                }
                for member in users.values('id', 'first_name', 'last_name', 'avatar')
            ]
            current_time = timezone.now()
            data = {
                'id': conversation.id, 
                'title': conversation.title, 
                'image': conversation.image,
                'latest_message': {
                    'id': message.id,
                    'message': message.message,
                    'sender': sender.id,
                    'created_at': current_time.isoformat()
                },
                'type': conversation.type,
                'members': members_info
            }
            send_message_to_conversation_members(conversation.id, 'add_group', data)
            return SuccessResponse(data=data, status=status.HTTP_201_CREATED)  
        return ErrorResponse(error_message=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
class ConversationDetail(APIView):
    def get_object(self, pk):
        try:
            return Conversation.objects.get(pk=pk)
        except Conversation.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        conversation = self.get_object(pk)
        serializer = ConversationSerializer(conversation)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        conversation = self.get_object(pk)
        serializer = ConversationSerializer(conversation, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        conversation = self.get_object(pk)
        conversation.delete()
        return Response({"message": "Conversation deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

class PaticipantsList(generics.ListCreateAPIView):
    serializer_class = CreateParticipantsSerializer
    permission_classes = [IsAuthenticated]
    
    # Add members to the conversation
    def post(self, request):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 
    
class ParicipantsDetail(APIView):
    def get_object(self, pk):
        try:
            return Participants.objects.get(pk=pk)
        except Participants.DoesNotExist:
            raise Http404

    # Change title conversation
    def put(self, request, pk, format=None):
        participant = self.get_object(pk)
        serializer = ParticipantDetailSerializer(participant, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Delete member from conversation
    def delete(self, request, pk, format=None):
        participant = self.get_object(pk)
        participant.delete()
        return Response({"message": "Member deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
    
class GetMemberConversation(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, pk, format=None):
        conversation = Conversation.objects.get(pk=pk)
        participants = Participants.objects.filter(conversation=conversation)
        users = [participant.user for participant in participants]
        serializer = MemberConversationSerializer(users, many=True)
        return Response(serializer.data)
    

class GetMessagesConversation(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPagination
    serializer_class = MessageSerializer

    def get_queryset(self, request):
        pk = self.kwargs.get('pk')
        participant = Participants.objects.filter(conversation_id=pk, user_id=self.request.user.id).first()
        if participant:
            messages = Message.objects.filter(conversation=pk).exclude(deletemessage__user=request.user).order_by('-created_at')
            return messages
        else:
            return Message.objects.none()  # Return an empty queryset if the user doesn't have access

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset(request)
        page = self.paginate_queryset(queryset)[::-1]
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class MesssageDetail(generics.DestroyAPIView):
    def get_object(self, pk):
        try:
            return Message.objects.get(pk=pk)
        except Message.DoesNotExist:
            raise Http404 
        
    # Delete message
    def delete(self, request, pk, format=None):
        message = self.get_object(pk)
        delete_message = DeleteMessage.objects.create(message=message,user=request.user)
        serializer = DeleteMessageSerializer(delete_message)
        return SuccessResponse(data=serializer.data)
    
    # Recall message
    def put(self, request, pk, format=None):
        message_obj = self.get_object(pk)
        if request.user != message_obj.sender:
            return ErrorResponse(error_message="You are not the sender of this message")
        message_obj.message_type = Message.MessageType.RECALL
        message_obj.message = ""
        message_obj.save()
        serializer = MessageSerializer(message_obj)
        send_message_to_conversation_members(message_obj.conversation_id, 'recall_message', serializer.data)
        return SuccessResponse(data=serializer.data)
    
class ConversationListFind(APIView):
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        search_query = request.GET.get('query')
        conversations = Conversation.objects.filter(participants__user=request.user)
        
        conversations = conversations.annotate(
            latest_message_time=Max('message__created_at')
        ).order_by('-latest_message_time')

        conversation_data = []
        
        for conversation in conversations:
            users = User.objects.filter(participants__conversation=conversation)
            
            conversation_info = {
                'id': conversation.id, 
                'title': conversation.title, 
                'image': conversation.image,
                'type': conversation.type,
                'members': users
            }

            def check_query(x):
                search_query_lower = search_query.lower()
                v = filter(lambda x: search_query_lower in x, map(lambda x: f'{x.first_name} {x.last_name}'.lower(), x.get('members')))
                return search_query_lower in x.get('title') or len(list(v)) > 0
            
            if not search_query or check_query(conversation_info):
                conversation_data.append(conversation_info)
        
        serializer = self.serializer_class(conversation_data, many=True)
        return SuccessResponse(data=serializer.data)


class PinConversationUser(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        serializer = PinConversationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        conversation_id = serializer.validated_data['conversation_id']
        conversation = Conversation.objects.get(id=conversation_id)
        check_pin = PinConversation.objects.filter(conversation=conversation, user=request.user).exists()
        if check_pin: 
            return ErrorResponse(error_message="You have already pinned this conversation", status=status.HTTP_400_BAD_REQUEST)
        pin_conversation = PinConversation.objects.create(
            user=request.user,
            conversation=conversation
        )
        serializer = PinConversationSerializer(pin_conversation)
        return SuccessResponse(data=serializer.data, status=status.HTTP_201_CREATED)

class UnpinConversationUser(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        serializer = PinConversationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        conversation_id = serializer.validated_data['conversation_id']
        conversation = Conversation.objects.get(id=conversation_id)
        try:
            pinned_conversation = PinConversation.objects.get(conversation=conversation, user=request.user)
        except PinConversation.DoesNotExist:
            return ErrorResponse(error_message="You have not pinned this conversation", status=status.HTTP_400_BAD_REQUEST)
        pinned_conversation.delete()
        return SuccessResponse(data={"conversation_id": conversation_id}, status=status.HTTP_200_OK)

class LeaveConversation(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CloseConversationSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = request.user
        conversation_id = serializer.validated_data['conversation_id']
        conversation = Conversation.objects.get(id=conversation_id)
        try:
            participant = Participants.objects.get(conversation_id=conversation_id, user=user)
            participant.delete()
            message = Message.objects.create(
                    conversation=conversation,
                    sender=user,
                    message=f'{user.first_name} {user.last_name} left the conversation',
                    message_type=Message.MessageType.NEWS
                )
            message_serializer = MessageSerializer(instance=message)
            send_message_to_conversation_members(message.conversation_id, 'chat_message', message_serializer.data)
        except Participants.DoesNotExist:
            return ErrorResponse(error_message="Conversation does not exist for this user", status=status.HTTP_400_BAD_REQUEST)
        return SuccessResponse(data={"conversation_id": conversation_id}, status=status.HTTP_200_OK)
        
class GetAttachmentConversation(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPagination  

    def get_queryset(self):
        pk = self.kwargs.get('pk')
        message_type = self.request.query_params.get('type')
        queryset = Attachments.objects.filter(message__conversation_id=pk)
        queryset = queryset.exclude(message__deletemessage__user=self.request.user)
        if message_type:
            queryset = queryset.filter(message__message_type=message_type)
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        # page = self.paginate_queryset(queryset)[::-1]
        # if page is not None:
        #     serializer = AttachmentSerializer(page, many=True)
        #     return self.get_paginated_response(serializer.data)
        serializer = AttachmentSerializer(queryset, many=True)
        return Response(serializer.data)
    
    
    
class PinnedMessagesList(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPagination
    serializer_class = MessageSerializer

    def get_queryset(self, request):
        pk = self.kwargs.get('pk')
        participant = Participants.objects.filter(conversation_id=pk, user_id=self.request.user.id).first()
        if participant:
            messages = Message.objects.filter(pinnedmessages__conversation_id=pk).exclude(deletemessage__user=request.user).order_by('-created_at')
            return messages
        else:
            return Message.objects.none()  # Return an empty queryset if the user doesn't have access

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset(request)
        page = self.paginate_queryset(queryset)[::-1]
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    def post(self, request, *args, **kwargs):
        conversation_id = kwargs.get('pk')
        message_id = request.data.get('message_id')
        serializer = PinnedMessagesCreateSerializer(data={'message_id': message_id}, context={'request': request, 'pk': conversation_id})
        if serializer.is_valid():
            pinned_message = serializer.save()
            message = Message.objects.create(
                    conversation=pinned_message.conversation,
                    sender=request.user,
                    message=f'{request.user.get_full_name} pinned a message.',
                    message_type=Message.MessageType.NEWS
            )
            message_serializer = MessageSerializer(instance=message)
            message_pinned = PinnedMessagesSerializer(instance={
                'conversation_id': conversation_id, 
                'message_id': message_id,
                'is_pinned': True
            })
            send_message_to_conversation_members(message.conversation.id, 'chat_message', message_serializer.data)
            send_message_to_conversation_members(message.conversation.id, 'pin_message', message_pinned.data)
            return SuccessResponse(data={"message_id": pinned_message.message.id}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class DeletePinnedMessage(APIView):
    def get_object(self, pk, message_id):
        try:
            return PinnedMessages.objects.filter(message_id=message_id, conversation_id=pk).first()
        except PinnedMessages.DoesNotExist:
            raise Http404

    def delete(self, request, pk, message_id, format=None):
        pinned_message = self.get_object(pk, message_id)
        if pinned_message is not None:
            pinned_message.delete()
            message = Message.objects.create(
                    conversation=pinned_message.conversation,
                    sender=request.user,
                    message=f'{request.user.get_full_name} unpinned a message.',
                    message_type=Message.MessageType.NEWS
            )
            message_serializer = MessageSerializer(instance=message)
            message_pinned = PinnedMessagesSerializer(instance={
                'conversation_id': pk, 
                'message_id': message_id,
                'is_pinned': False
            })
            send_message_to_conversation_members(message.conversation.id, 'chat_message', message_serializer.data)
            send_message_to_conversation_members(message.conversation.id, 'pin_message', message_pinned.data)
            return SuccessResponse(data={"message_id": message_id}, status=status.HTTP_200_OK)
        else:
            raise Http404

