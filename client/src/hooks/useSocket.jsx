import { useContext } from 'react';
import { SocketContext } from '../contexts/socketContext';
import { fileToBase64 } from '~/utils/convertToBase64';
import { CallTypes } from '~/utils/enum';

export const useSocket = () => {
  const { socketInstance } = useContext(SocketContext);

  const emitMessage = async ({
    conversation_id,
    message = '',
    attachment = null,
    namecard = null,
    message_type,
    forward = null,
    conversation
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
        message_type,
        conversation
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
          source: 'init_call',
          conversation_id,
          peer_id,
          type: CallTypes.VIDEO
        })
      );
    }
  };

  const emitVoiceCall = ({ conversation_id, peer_id }) => {
    if (socketInstance) {
      socketInstance.send(
        JSON.stringify({
          source: 'init_call',
          conversation_id,
          peer_id,
          type: CallTypes.AUDIO
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
  const emitLeaveVideoCall = ({ conversation_id, peer_id }) => {
    if (socketInstance) {
      socketInstance.send(
        JSON.stringify({
          source: 'leave_video_call',
          conversation_id,
          peer_id
        })
      );
    }
  };
  const emitCancelVideoCall = ({ conversation_id }) => {
    if (socketInstance) {
      socketInstance.send(
        JSON.stringify({
          source: 'cancel_video_call',
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

  const emitGetPeerIds = ({ conversation_id }) => {
    if (socketInstance) {
      socketInstance.send(
        JSON.stringify({
          source: 'get_peer_ids',
          conversation_id: parseInt(conversation_id)
        })
      );
    }
  };

  const emitEndVideoCall = ({ conversation_id, duration }) => {
    if (socketInstance) {
      socketInstance.send(
        JSON.stringify({
          source: 'end_video_call',
          conversation_id,
          duration
        })
      );
    }
  };
  // return
  return {
    emitMessage,
    emitVideoCall,
    emitVoiceCall,
    emitAcceptVideoCall,
    emitLeaveVideoCall,
    emitCancelVideoCall,
    emitRefuseVideoCall,
    emitTypingIndicator,
    emitGetPeerIds,
    emitEndVideoCall
  };
};
