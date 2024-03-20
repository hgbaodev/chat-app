import Cookies from 'js-cookie';
import { createContext, useEffect, useState } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { useDispatch, useSelector } from '~/store';
import { createGroup, receiverMessage } from '~/store/slices/chatSlice';
import { receiveNotification } from '~/store/slices/notificationSlice';
import { receiveFriendRequest } from '~/store/slices/relationshipSlice';
export const SocketContext = createContext({
  socketInstance: null
});

export const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
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
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'chat_message') {
            dispatch(receiverMessage(data));
          } else if (data.type === 'receive_friend_request') {
            dispatch(receiveFriendRequest(data.message));
          } else if (data.type === 'receive_notification') {
            dispatch(receiveNotification(data.message));
          } else if (data.type === 'add_group') {
            dispatch(createGroup(data.message));
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
