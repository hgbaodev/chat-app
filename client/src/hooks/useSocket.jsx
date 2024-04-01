import { useContext } from 'react';
import { SocketContext } from '../contexts/socketContext';
import { fileToBase64 } from '~/utils/convertToBase64';

export const useSocket = () => {
  const { socketInstance } = useContext(SocketContext);

  const emitMessage = async ({
    conversation_id,
    message = '',
    attachment = null,
    namecard = null,
    message_type,
    forward = null
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
        attachment,
        namecard,
        forward,
        message_type
      })
    );
  };

  const emitTypingIndicator = ({ conversation_id, typing }) => {
    if (socketInstance) {
      socketInstance.send(
        JSON.stringify({
          source: 'typing_indicator',
          conversation_id,
          typing
        })
      );
    }
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

  const emitAcceptVideoCall = ({ conversation_id, peer_id }) => {
    if (socketInstance) {
      socketInstance.send(
        JSON.stringify({
          source: 'accept_video_call',
          conversation_id,
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
  const emitRefuseVideoCall = ({ conversation_id }) => {
    if (socketInstance) {
      socketInstance.send(
        JSON.stringify({
          source: 'refuse_video_call',
          conversation_id
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
    emitRefuseVideoCall,
    emitTypingIndicator
  };
};
