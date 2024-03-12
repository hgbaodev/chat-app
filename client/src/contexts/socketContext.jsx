import Cookies from 'js-cookie';
import { createContext, useEffect, useState } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { useDispatch, useSelector } from '~/store';
import { receiverMessage } from '~/store/slices/chatSlice';
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
    const endpoint = `ws://127.0.0.1:8000/ws/chat/${token}/`;
    var socket = new ReconnectingWebSocket(endpoint);

    socket.onopen = function (e) {
      console.log('socket connected');
    };

    socket.onmessage = function (event) {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'chat_message') {
          dispatch(receiverMessage(data.message));
        } else if (data.type === 'receive_friend_request') {
          dispatch(receiveFriendRequest(data.message));
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    socket.onclose = function (e) {
      console.log('socket disconnected');
    };

    setSocketInstance(socket);

    // clean up
    return () => {
      socket.close();
    };
  }, [dispatch, isAuthenticated]);
  return (
    <SocketContext.Provider value={{ socketInstance }}>
      {children}
    </SocketContext.Provider>
  );
};
