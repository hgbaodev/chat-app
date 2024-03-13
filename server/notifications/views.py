from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated
from .models import Notification



class GetNumberOfUnseenNotificationsView(GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.user.id
        total = Notification.objects.filter(receiver=user_id, seen=False).count()
        return Response({'result': total}, status=status.HTTP_200_OK)