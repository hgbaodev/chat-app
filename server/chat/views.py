from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics
from .serializers import MemberConversationSerializer, ParticipantDetailSerializer, ConversationSerializer, CreateParticipantsSerializer,MessageSerializer
from rest_framework.permissions import IsAuthenticated
from .models import Conversation, Participants, Message
from django.http import Http404
from django.db.models import Max
    
class ConversationList(APIView):
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]
    
    # Lấy danh sách cuộc hội thoại (Chưa lấy được tin nhắn mới nhất)
    def get(self, request):
        conversations = Conversation.objects.filter(participants__user=request.user)
        # 
        print('conversations', conversations)

        # 
        conversation_data = []
        for conversation in conversations:
            latest_message = Message.objects.filter(conversation=conversation).aggregate(Max('created_at'))
            if latest_message['created_at__max'] is not None:
                latest_message_instance = Message.objects.filter(conversation=conversation, created_at=latest_message['created_at__max']).first()
                conversation_data.append({
                    'id': conversation.id, 
                    'title': conversation.title, 
                    'image': conversation.image, 
                    'latest_message': latest_message_instance
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

    def get(self, request, pk, format=None):
        conversation = Conversation.objects.get(pk=pk)
        messages = Message.objects.filter(conversation=conversation)
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)