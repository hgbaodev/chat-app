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

  const emitVideoCall = ({ conversation_id }) => {
    if (socketInstance) {
      socketInstance.send(
        JSON.stringify({
          source: 'video_call',
          conversation_id
        })
      );
      console.log('send video call', { conversation_id });
    }
  };

  // return
  return {
    emitMessage,
    emitVideoCall
  };
};
