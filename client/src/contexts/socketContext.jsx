import Cookies from 'js-cookie';
import { createContext, useEffect, useState } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { useDispatch, useSelector } from '~/store';
import {
  changeStatePinMessage,
  changeStatusUser,
  createGroup,
  recallMessage,
  receiveChangeNameConversation,
  receiverMessage,
  resetVideoCall,
  setCall,
  setConversationCall,
  setCallMembers,
  setTypingIndicator,
  updateVideoCallMessage,
  removeConversation,
  deleteMemberGroup
} from '~/store/slices/chatSlice';
import { receiveNotification } from '~/store/slices/notificationSlice';
import { receiveFriendRequest } from '~/store/slices/relationshipSlice';
export const SocketContext = createContext({
  socketInstance: null
});

export const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [socketInstance, setSocketInstance] = useState(null);

  // effect
  useEffect(() => {
    let token = Cookies.get('token');
    if (!token) return;
    if (isAuthenticated) {
      const endpoint = `wss://chatossd.vercel.app/ws/chat/${token}/`;
      var socket = new ReconnectingWebSocket(endpoint);

      socket.onopen = function (e) {
        console.log(`socket connected ${e}`);
      };

      socket.onmessage = function (event) {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'chat_message') {
            dispatch(receiverMessage(data));
          } else if (data.type === 'typing_indicator') {
            console.log(JSON.parse(data.message));
            dispatch(setTypingIndicator(JSON.parse(data.message)));
          } else if (data.type === 'receive_friend_request') {
            dispatch(receiveFriendRequest(data.message));
          } else if (data.type === 'receive_notification') {
            dispatch(receiveNotification(data.message));
          } else if (data.type === 'add_group') {
            dispatch(createGroup(data.message));
          } else if (data.type === 'recall_message') {
            dispatch(recallMessage(data.message));
          } else if (data.type === 'video_call') {
            const { conversation, type } = JSON.parse(data.message);
            dispatch(
              setCall({
                open: true,
                calling: false,
                ended: false,
                refused: false,
                type
              })
            );
            dispatch(setConversationCall({ conversation }));
          } else if (data.type === 'return_get_peer_ids') {
            console.log(data);
            const { conversation, members } = JSON.parse(data.message);
            dispatch(setConversationCall({ conversation }));
            dispatch(setCallMembers({ members }));
            if (members.length === 1) {
              dispatch(
                setCall({
                  calling: false,
                  refused: false,
                  ended: false
                })
              );
            } else {
              dispatch(
                setCall({
                  calling: true,
                  refused: false,
                  ended: false
                })
              );
            }
          } else if (data.type === 'refuse_video_call') {
            const { conversation_id, message_id } = JSON.parse(data.message);
            dispatch(
              setCall({
                calling: false,
                ended: false,
                refused: true
              })
            );
            dispatch(
              updateVideoCallMessage({
                conversation_id,
                message_id,
                duration: 0
              })
            );
          } else if (data.type === 'accept_video_call') {
            const { members } = JSON.parse(data.message);
            dispatch(setCallMembers({ members }));
            dispatch(
              setCall({
                calling: true,
                ended: false,
                refused: false
              })
            );
          } else if (data.type === 'leave_video_call') {
            const { members } = JSON.parse(data.message);
            dispatch(setCallMembers({ members }));
          } else if (data.type === 'cancel_video_call') {
            const { conversation_id, message_id } = JSON.parse(data.message);
            dispatch(
              updateVideoCallMessage({
                conversation_id,
                message_id,
                duration: 0
              })
            );
            dispatch(
              setCall({
                open: false,
                calling: false,
                refused: false,
                ended: true
              })
            );
          } else if (data.type === 'end_video_call') {
            const { conversation_id, message_id, duration } = JSON.parse(
              data.message
            );
            dispatch(resetVideoCall({ conversation_id, message_id, duration }));
          } else if (data.type === 'change_name_conversation') {
            dispatch(receiveChangeNameConversation(data.message));
          } else if (data.type === 'online_notification') {
            dispatch(changeStatusUser(data.message));
          } else if (data.type === 'pin_message') {
            dispatch(changeStatePinMessage(data.message));
          } else if (data.type === 'delete_member') {
            dispatch(deleteMemberGroup(data.message));
            if (data.message.user_id === user.id) {
              dispatch(removeConversation(data.message.conversation_id));
            }
          }
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      };

      socket.onclose = function (e) {
        console.log(`socket disconnected ${e}`);
      };

      setSocketInstance(socket);

      // clean up
      return () => {
        socket.close();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isAuthenticated]);
  return (
    <SocketContext.Provider value={{ socketInstance }}>
      {children}
    </SocketContext.Provider>
  );
};
