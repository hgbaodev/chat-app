import Cookies from 'js-cookie';
import { createContext, useEffect, useState } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { useSelector } from '~/store';
export const SocketContext = createContext({
  socket: null,
  isConnected: false
});

export const SocketProvider = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [socket, setSocket] = useState(null);

  // effect
  useEffect(() => {
    let token = Cookies.get('token');
    if (!token) return;
    const endpoint = `ws://127.0.0.1:8000/ws/chat/${token}/`;
    var socket = new ReconnectingWebSocket(endpoint);

    setSocket(socket);

    socket.onopen = function (e) {
      socket.send(
        JSON.stringify({
          source: 'message_send',
          message: 'Nội dung tin nhắn',
          message_type: '1',
          conversation_id: '1'
        })
      );
      console.log('socket connected');
    };

    socket.onmessage = function (event) {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'chat_message') {
          console.log('Server response:', data);
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    socket.onclose = function (e) {
      console.log('socket disconnected');
    };

    // clean up
    return () => {
      socket.close();
    };
  }, [isAuthenticated]);
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
