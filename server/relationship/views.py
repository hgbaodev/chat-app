from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import CreateAPIView, GenericAPIView
from .serializers import (SendFriendRequestSerializer, DeleteFriendRequestSerializer, AcceptFriendRequestSerializer, 
                          DeleteFriendSerializer, BlockFriendSerializer, UnBlockFriendSerializer,
                          RecommendedUserSerializer, GetAllFriensSerializer, SearchUsersSerializer)
from rest_framework.permissions import IsAuthenticated

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
            return Response({"msg": "Cancel friend request successfully"}, status=status.HTTP_201_CREATED)
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    

class RefuseFriendRequestView(GenericAPIView):
    serializer_class = DeleteFriendRequestSerializer
    permission_classes = [IsAuthenticated]
    def delete(self, request, sender):
        request.data['receiver'] = request.user.id
        request.data['sender'] = sender
        serializer = self.get_serializer(data=request.data)
        if  serializer.is_valid(raise_exception=True):
            return Response({"msg": "Refused friend request successfully"}, status=status.HTTP_201_CREATED)
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    
class AcceptFriendRequestView(GenericAPIView):
    serializer_class = AcceptFriendRequestSerializer
    permission_classes = [IsAuthenticated]
    def get(self, request, sender):
        request.data['receiver'] = request.user.id
        request.data['sender'] = sender
        serializer = self.get_serializer(data=request.data)
        if  serializer.is_valid(raise_exception=True):
            return Response({"data": serializer.data}, status=status.HTTP_201_CREATED)
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
    

class BlockFriendView(GenericAPIView):
    serializer_class = BlockFriendSerializer
    permission_classes = [IsAuthenticated]
    
    def get(self, request, friend_id):
        request.data['blocked_by'] = request.user.id
        request.data['user'] = friend_id
        serializer = self.get_serializer(data=request.data)
        if  serializer.is_valid(raise_exception=True):
            return Response({"msg": "Blocked friend successfully"}, status=status.HTTP_201_CREATED)
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class UnBlockFriendView(GenericAPIView):
    serializer_class = UnBlockFriendSerializer
    permission_classes = [IsAuthenticated]
    
    def get(self, request, friend_id):
        request.data['blocked_by'] = request.user.id
        request.data['user'] = friend_id
        serializer = self.get_serializer(data=request.data)
        if  serializer.is_valid(raise_exception=True):
            return Response({"msg": "Unblocked friend successfully"}, status=status.HTTP_201_CREATED)
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    

class GetAllFriendsView(GenericAPIView):
    serializer_class = GetAllFriensSerializer
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
