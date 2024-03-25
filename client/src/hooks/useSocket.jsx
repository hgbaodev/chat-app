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

  const emitVideoCall = ({ conversation_id, peer_id }) => {
    if (socketInstance) {
      socketInstance.send(
        JSON.stringify({
          source: 'video_call',
          conversation_id,
          peer_id
        })
      );
    }
  };
  const emitAcceptVideoCall = ({ user_id, peer_id }) => {
    if (socketInstance) {
      socketInstance.send(
        JSON.stringify({
          source: 'accept_video_call',
          user_id,
          peer_id
        })
      );
    }
  };
  const emitInterruptVideoCall = ({ conversation_id }) => {
    if (socketInstance) {
      socketInstance.send(
        JSON.stringify({
          source: 'interrupt_video_call',
          conversation_id
        })
      );
    }
  };
  const emitRefuseVideoCall = ({ user_id }) => {
    if (socketInstance) {
      socketInstance.send(
        JSON.stringify({
          source: 'refuse_video_call',
          user_id
        })
      );
    }
  };

  // return
  return {
    emitMessage,
    emitVideoCall,
    emitAcceptVideoCall,
    emitInterruptVideoCall,
    emitRefuseVideoCall
  };
};
