from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics
from .serializers import MemberConversationSerializer, ParticipantDetailSerializer, ConversationSerializer, CreateParticipantsSerializer,MessageSerializer
from rest_framework.permissions import IsAuthenticated
from .models import Conversation, Participants, Message
from django.http import Http404, HttpResponseForbidden
from django.db.models import Max
from config.paginations import CustomPagination
class ConversationList(APIView):
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        conversations = Conversation.objects.filter(participants__user=request.user)
        # 
        conversation_data = []
        for conversation in conversations:
            sorted_messages = Message.objects.filter(conversation=conversation.id).order_by('-created_at')

            latest_message = sorted_messages.first()

            if latest_message is not None:
                conversation_data.append({
                    'id': conversation.id, 
                    'title': conversation.title, 
                    'image': conversation.image, 
                    'latest_message': latest_message
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

    def get_queryset(self):
        pk = self.kwargs.get('pk')
        participant = Participants.objects.filter(conversation_id=pk, user_id=self.request.user.id).first()
        if participant:
            messages = Message.objects.filter(conversation=pk).order_by('-created_at')
            return messages
        else:
            return Message.objects.none()  # Return an empty queryset if the user doesn't have access

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)[::-1]
        print(page)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
       