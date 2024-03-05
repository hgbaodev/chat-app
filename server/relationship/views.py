from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import GenericAPIView
from .serializers import (SendFriendRequestSerializer, DeleteFriendRequestSerializer,
                        AcceptFriendRequestSerializer, DeleteFriendSerializer, BlockFriendSerializer, 
                        UnBlockFriendSerializer,RecommendedUserSerializer, GetAllFriendsSerializer, 
                        SearchUsersSerializer, GetAllFriendRequestSerializer)
from rest_framework.permissions import IsAuthenticated


class FriendRequestsView(GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return GetAllFriendRequestSerializer
        elif self.request.method == 'POST':
            return SendFriendRequestSerializer
        return GetAllFriendRequestSerializer 
    
    # get all friend-requests
    def get(self, request):
        user_id = request.user.id
        serializer_class = self.get_serializer_class()
        serializer = serializer_class()
        friend_requests = serializer.get_all_friend_requests(user_id)
        serialized_data = serializer_class(friend_requests, many=True).data

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
        serializer_class = self.get_serializer_class()
        serializer = serializer_class(data=request.data, context={'request': request})
        if serializer.is_valid(raise_exception=True):
            serializer.save()
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
        friends = self.serializer_class.get_all_friends(user_id)
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
    
