import Cookies from 'js-cookie';
import { createContext, useEffect, useState } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { useDispatch, useSelector } from '~/store';
import {
  createGroup,
  recallMessage,
  receiverMessage,
  setCall,
  setConversationCall,
  setPeerIds,
  setTypingIndicator
} from '~/store/slices/chatSlice';
import { receiveNotification } from '~/store/slices/notificationSlice';
import { receiveFriendRequest } from '~/store/slices/relationshipSlice';
export const SocketContext = createContext({
  socketInstance: null
});

export const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { call } = useSelector((state) => state.chat);
  const [socketInstance, setSocketInstance] = useState(null);

  // effect
  useEffect(() => {
    let token = Cookies.get('token');
    if (!token) return;
    if (isAuthenticated) {
      const endpoint = `ws://127.0.0.1:8000/ws/chat/${token}/`;
      var socket = new ReconnectingWebSocket(endpoint);

      socket.onopen = function (e) {
        console.log(`socket connected ${e}`);
      };

      socket.onmessage = function (event) {
        console.log('socket event', event.data);
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
            const { conversation, peer_ids } = JSON.parse(data.message);
            dispatch(
              setCall({
                open: true,
                calling: false,
                ended: false,
                refused: false
              })
            );
            dispatch(setConversationCall({ conversation }));
            dispatch(setPeerIds({ peer_ids }));
          } else if (data.type === 'accept_video_call') {
            if (!call.open) {
              const { peer_ids } = JSON.parse(data.message);
              console.log(`accept_video_call from `, peer_ids);
              dispatch(
                setCall({
                  calling: true,
                  refused: false,
                  ended: false
                })
              );
            }
          } else if (data.type === 'return_accept_video_call') {
            const { peer_id, peer_ids, conversation } = JSON.parse(
              data.message
            );
            const width = 1000;
            const height = 600;
            const leftPos = (window.innerWidth - width) / 2;
            const topPos = (window.innerHeight - height) / 2;
            window.open(
              `/video-call/${peer_id}?calling=true&refused=false&ended=false&conversation_id=${
                conversation.conversation_id
              }&peer_ids=${JSON.stringify(peer_ids)}&type=${
                conversation.type
              }&title=${conversation.title}&image=${conversation.image}`,
              '_blank',
              `width=${width}, height=${height}, left=${leftPos}, top=${topPos}`
            );
            dispatch(setCall({ open: false }));
          } else if (data.type === 'refuse_video_call') {
            dispatch(
              setCall({
                calling: false,
                ended: false,
                refused: true
              })
            );
          } else if (data.type === 'interrupt_video_call') {
            console.log('receiver here');
            dispatch(
              setCall({
                open: false,
                calling: false,
                ended: true
              })
            );
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
  }, [dispatch, isAuthenticated]);
  return (
    <SocketContext.Provider value={{ socketInstance }}>
      {children}
    </SocketContext.Provider>
  );
};
