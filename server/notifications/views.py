from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated
from .models import Notification
from .serializers import NotificationSerializer




class GetAllNotificationsView(GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.user.id
        notification = Notification.objects.filter(receiver=user_id)
        return Response({'result': NotificationSerializer(notification, many=True).data }, status=status.HTTP_200_OK)

class GetNumberOfUnseenNotificationsView(GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.user.id
        total = Notification.objects.filter(receiver=user_id, seen=False).count()
        return Response({'result': total}, status=status.HTTP_200_OK)
    
class MarkAllNotificationsAsSeenView(GenericAPIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user_id = request.user.id
        Notification.objects.filter(receiver=user_id).update(seen=True)
        return Response({'result': 'All notifications marked as seen'}, status=status.HTTP_200_OK)