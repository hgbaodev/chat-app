import { useContext } from 'react';
import { SocketContext } from '../contexts/socketContext';

export const useSocket = () => {
  const { socketInstance } = useContext(SocketContext);

  const emitMessage = ({
    conversation_id,
    conversation,
    message,
    message_type,
    forward
  }) => {
    console.log({ conversation_id, conversation, message, message_type });
    socketInstance.send(
      JSON.stringify({
        source: 'message_send',
        conversation_id,
        conversation,
        message,
        forward,
        message_type
      })
    );
  };

  // return
  return {
    emitMessage
  };
};
