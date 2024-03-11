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
    const endpoint = 'ws://127.0.0.1:8000/ws/chat/';
    var socket = new ReconnectingWebSocket(endpoint);
    socket.headers = {
      authorization: `Bearer ${Cookies.get('token')}`
    };

    setSocket(socket);

    socket.onopen = function (e) {
      socket.send(JSON.stringify({ type: 'has_connected' }));
      console.log('socket connected');
    };

    socket.onmessage = function (event) {
      const data = JSON.parse(event.data);
      if (data.type === 'connected_response') {
        console.log('Server response:', data.message);
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
