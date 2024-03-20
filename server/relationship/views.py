from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import GenericAPIView
from .serializers import (SendFriendRequestSerializer, DeleteFriendRequestSerializer,
                        AcceptFriendRequestSerializer, DeleteFriendSerializer, BlockFriendSerializer, 
                        UnBlockFriendSerializer,RecommendedUserSerializer, GetAllFriendsSerializer, 
                        SearchUsersSerializer, GetAllFriendRequestSerializer)
from rest_framework.permissions import IsAuthenticated
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from .models import FriendRequest
from notifications.models import Notification
from notifications.serializers import NotificationSerializer

class FriendRequestsView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    
    # get all friend-requests
    def get(self, request):
        user_id = request.user.id
        serializer = GetAllFriendRequestSerializer()
        friend_requests = serializer.get_all_friend_requests(user_id)
        serialized_data = GetAllFriendRequestSerializer(friend_requests, many=True).data

        sent_friend_requests = []
        received_friend_requests = []
        for friend_request in serialized_data:
            if friend_request['sender']['id'] == user_id:
                sent_friend_requests.append(friend_request)
            else:
                received_friend_requests.append(friend_request)
        
        return Response({'sent_friend_requests': sent_friend_requests, 'received_friend_requests': received_friend_requests}, status=status.HTTP_200_OK)

    #  create friend-request
    def post(self, request):
        request.data['sender'] = request.user.id
        serializer = SendFriendRequestSerializer(data=request.data, context={'request': request})
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            channel_layer = get_channel_layer()
            # create notification
            notification =  Notification.objects.create(
                receiver=serializer.validated_data['receiver'],
                title = "Friend request notification",
                message=f"{serializer.validated_data['sender'].get_full_name} sent you a friend request"
            )
            # socket response
            async_to_sync(channel_layer.group_send)(
                'user_%s' % serializer.validated_data['receiver'].pk, {
                    'type': 'receive_friend_request',
                    'message': serializer.data
                }
            )
            async_to_sync(channel_layer.group_send)(
                'user_%s' % serializer.validated_data['receiver'].pk, {
                    'type': 'receive_notification',
                    'message': NotificationSerializer(notification).data
                }
            )
            return Response({"msg": "Sent friend request successfully!"}, status=status.HTTP_201_CREATED)
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class ManageFriendRequestView(GenericAPIView):
    permission_classes = [IsAuthenticated]

    #  cancel and refuse friend-request
    def delete(self, request, friend_request_id):
        request.data['id'] = friend_request_id
        serializer = DeleteFriendRequestSerializer(data=request.data, context={'request': request})
        if serializer.is_valid(raise_exception=True):
            return Response({"msg": "Deleted friend request successfully", "id": serializer.data['id']}, status=status.HTTP_201_CREATED)
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    
    #  accept friend-request
    def get(self, request, friend_request_id):
        request.data['id'] = friend_request_id
        serializer = AcceptFriendRequestSerializer(data=request.data, context={'request': request})

        if serializer.is_valid(raise_exception=True):
            return Response({"msg": "Accepted request successfully", "id": serializer.data['id']}, status=status.HTTP_201_CREATED)
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    

class DeleteFriendView(GenericAPIView):
    serializer_class = DeleteFriendSerializer
    permission_classes = [IsAuthenticated]
    
    def delete(self, request, friend_id):
        request.data['user_1'] = request.user.id
        request.data['user_2'] = friend_id
        serializer = self.get_serializer(data=request.data)
        if  serializer.is_valid(raise_exception=True):
            return Response({"msg": "Deleted friend successfully"}, status=status.HTTP_201_CREATED)
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    

class BlockUnblockFriendView(GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, friend_id):
        request.data['blocked_by'] = request.user.id
        request.data['user'] = friend_id
        serializer = BlockFriendSerializer(data=request.data, context={'request': request})
        if serializer.is_valid(raise_exception=True):
            return Response({"msg": "Blocked friend successfully"}, status=status.HTTP_201_CREATED)
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, friend_id):
        request.data['blocked_by'] = request.user.id
        request.data['user'] = friend_id
        serializer = UnBlockFriendSerializer(data=request.data, context={'request': request})
        if serializer.is_valid(raise_exception=True):
            return Response({"msg": "Unblocked friend successfully"}, status=status.HTTP_201_CREATED)
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    

class GetAllFriendsView(GenericAPIView):
    serializer_class = GetAllFriendsSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.user.id
        query = request.GET.get('query')
        sort = request.GET.get('sort')
        friends = self.serializer_class.get_all_friends(user_id, query, sort)
        serializer = self.serializer_class(friends, many=True)

        return Response({'friends': serializer.data}, status=status.HTTP_200_OK)
    
class GetRecommendedUserView(GenericAPIView):
    serializer_class = RecommendedUserSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.user.id
        recommended_users = self.serializer_class.get_recommended_users(user_id)
        serializer = self.serializer_class(recommended_users, many=True)

        return Response({'users': serializer.data}, status=status.HTTP_200_OK)
    

class SearchUsersView(GenericAPIView):
    serializer_class = SearchUsersSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, search_text):
        user_id = request.user.id
        users = self.serializer_class.get_results(user_id, search_text)
        serializer = self.serializer_class(users, many=True, context={'request': request})

        return Response({'users': serializer.data}, status=status.HTTP_200_OK)
    
class GetNumberOfReceiveFriendRequestsView(GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = request.user.id
        friend_requests = FriendRequest.objects.filter(receiver=user_id).count()
        return Response({'result': friend_requests}, status=status.HTTP_200_OK)