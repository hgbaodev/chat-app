from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import CreateAPIView, GenericAPIView
from .serializers import SendFriendRequestSerializer, DeleteFriendRequestSerializer
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
# Create your views here.

class SendFriendRequestView(CreateAPIView):
    serializer_class = SendFriendRequestSerializer
    permission_classes = [IsAuthenticated]
    def post(self, request):
        request.data['sender'] = request.user.id
        serializer = self.get_serializer(data=request.data)
        if  serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({"data": serializer.data}, status=status.HTTP_201_CREATED)
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    

class CancelFriendRequestView(GenericAPIView):
    serializer_class = DeleteFriendRequestSerializer
    permission_classes = [IsAuthenticated]
    def delete(self, request, receiver):
        request.data['sender'] = request.user.id
        request.data['receiver'] = receiver
        serializer = self.get_serializer(data=request.data)
        if  serializer.is_valid(raise_exception=True):
            return Response({"msg": "Successfully"}, status=status.HTTP_201_CREATED)
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    

class RefuseFriendRequestView(GenericAPIView):
    serializer_class = DeleteFriendRequestSerializer
    permission_classes = [IsAuthenticated]
    def delete(self, request, sender):
        request.data['receiver'] = request.user.id
        request.data['sender'] = sender
        serializer = self.get_serializer(data=request.data)
        if  serializer.is_valid(raise_exception=True):
            return Response({"msg": "Successfully"}, status=status.HTTP_201_CREATED)
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)