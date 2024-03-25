import Cookies from 'js-cookie';
import { createContext, useEffect, useState } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { useDispatch, useSelector } from '~/store';
import {
  createGroup,
  recallMessage,
  receiverMessage,
  setCall
} from '~/store/slices/chatSlice';
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
          } else if (data.type === 'recall_message') {
            dispatch(recallMessage(data.message));
          } else if (data.type === 'video_call') {
            dispatch(
              setCall({
                open: true,
                calling: false,
                owner: false,
                user: JSON.parse(data.message)
              })
            );
          } else if (data.type === 'accept_video_call') {
            dispatch(
              setCall({
                calling: true,
                owner: true,
                user: JSON.parse(data.message)
              })
            );
            localStorage.setItem(
              'call',
              JSON.stringify({
                open: false,
                calling: true,
                owner: true,
                user: JSON.parse(data.message)
              })
            );
          } else if (data.type === 'refuse_video_call') {
            dispatch(
              setCall({
                calling: false,
                ended: false,
                refused: true,
                owner: true,
                user: null
              })
            );
            localStorage.setItem(
              'call',
              JSON.stringify({
                calling: false,
                ended: false,
                refused: true,
                owner: true,
                user: JSON.parse(data.message)
              })
            );
          } else if (data.type === 'interrupt_video_call') {
            console.log({ msg: data.message });
            dispatch(
              setCall({
                open: false,
                calling: false,
                ended: true,
                user: null
              })
            );
            localStorage.setItem(
              'call',
              JSON.stringify({
                calling: false,
                ended: true,
                refused: false,
                owner: true,
                user: JSON.parse(data.message)
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
