from rest_framework.generics import CreateAPIView
from rest_framework.views import APIView
from django.http import JsonResponse
from rest_framework import status
from .models import Group
from .serializers import GroupSerializer

class CreateGroup(CreateAPIView):

    def post(self, request, *args, **kwargs):
        serializer = GroupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GetAllGroups(APIView):
    def get(self, request, user_id):
        groups = Group.objects.filter(created_by=user_id)
        serializer = GroupSerializer(groups, many=True)
        # response
        return JsonResponse(serializer.data, safe=False, status=status.HTTP_200_OK)