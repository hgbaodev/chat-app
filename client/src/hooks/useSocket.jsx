import { useContext } from 'react';
import { SocketContext } from '../contexts/socketContext';
import { fileToBase64 } from '~/utils/convertToBase64';

export const useSocket = () => {
  const { socketInstance } = useContext(SocketContext);

  const emitMessage = async ({
    conversation_id,
    message = '',
    attachment = null,
    message_type,
    forward
  }) => {
    console.log({ conversation_id, message, attachment, message_type });
    if (attachment != null) {
      attachment = await fileToBase64(attachment);
    }
    socketInstance.send(
      JSON.stringify({
        source: 'message_send',
        conversation_id,
        message,
        attachment: attachment,
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

  // return
  return {
    emitMessage,
    emitVideoCall,
    emitAcceptVideoCall
  };
};
