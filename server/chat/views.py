from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics
from .serializers import MemberConversationSerializer, ParticipantDetailSerializer,DeleteMessageSerializer, ConversationSerializer, CreateParticipantsSerializer,MessageSerializer
from rest_framework.permissions import IsAuthenticated
from .models import Conversation, Participants, Message, DeleteMessage
from django.http import Http404
from django.db.models import Max
from config.paginations import CustomPagination
from utils.cloudinary import get_image_url
from django.db.models import Max
from utils.responses import SuccessResponse, ErrorResponse
from django.db.models import Q
from authentication.models import User

class ConversationList(APIView):
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Truy xuất danh sách các cuộc trò chuyện mà người dùng hiện tại tham gia
        conversations = Conversation.objects.filter(participants__user=request.user).annotate(
            latest_message_time=Max('message__created_at')
        ).order_by('-latest_message_time')
        
        conversation_data = []
        for conversation in conversations:
            users = User.objects.filter(participants__conversation=conversation)
            latest_message = Message.objects.filter(conversation=conversation).order_by('-created_at').first()
            if latest_message is not None:
                conversation_data.append({
                    'id': conversation.id, 
                    'title': conversation.title, 
                    'image': get_image_url(conversation.image),
                    'latest_message': latest_message,
                    'type': conversation.type,
                    'members': users
                })
        
        serializer = self.serializer_class(conversation_data, many=True)
        return Response(serializer.data)


    # Tạo cuộc hội thoại
    def post(self, request):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 
    
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
        
    def delete(self, request, pk, format=None):
        message = self.get_object(pk)
        delete_message = DeleteMessage.objects.create(message=message,user=request.user)
        serializer = DeleteMessageSerializer(delete_message)
        return SuccessResponse(data=serializer.data)
    
    def put(self, request, pk, format=None):
        pass
    
    

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
                'image': get_image_url(conversation.image),
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


