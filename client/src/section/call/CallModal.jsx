import { Avatar, Button, Modal, Space } from 'antd';
import { IoClose, IoVideocam } from 'react-icons/io5';
import { FaPhoneAlt } from 'react-icons/fa';
import { useSocket } from '~/hooks/useSocket';
import { useDispatch, useSelector } from '~/store';
import { setCall, setConversationCallingState } from '~/store/slices/chatSlice';
import { v4 as uuidv4 } from 'uuid';
import { CallTypes, ConversationTypes } from '~/utils/enum';

const CallModal = () => {
  const dispatch = useDispatch();
  const { emitAcceptVideoCall, emitRefuseVideoCall } = useSocket();
  const { call } = useSelector((state) => state.chat);
  // handle

  const handleAccept = () => {
    const peer_id = uuidv4();
    emitAcceptVideoCall({
      conversation_id: call.conversation.conversation_id,
      peer_id
    });
    const width = 1000;
    const height = 600;
    const leftPos = (window.innerWidth - width) / 2;
    const topPos = (window.innerHeight - height) / 2;
    dispatch(setCall({ open: false }));
    if (call.type === CallTypes.VIDEO) {
      window.open(
        `/call/${CallTypes.VIDEO}/${call.conversation.conversation_id}/${peer_id}`,
        '_blank',
        `width=${width}, height=${height}, left=${leftPos}, top=${topPos}`
      );
    } else {
      window.open(
        `/call/${CallTypes.AUDIO}/${call.conversation.conversation_id}/${peer_id}`,
        '_blank',
        `width=${width}, height=${height}, left=${leftPos}, top=${topPos}`
      );
    }
  };

  // handle refuse
  const handleRefuse = () => {
    if (call.conversation.type === ConversationTypes.FRIEND) {
      emitRefuseVideoCall({
        conversation_id: call.conversation.conversation_id
      });
      dispatch(
        setConversationCallingState({
          conversation_id: call.conversation.conversation_id,
          calling: false
        })
      );
    }
    dispatch(setCall({ open: false }));
  };
  // render
  return (
    <>
      <Modal
        title={call?.type == CallTypes.VIDEO ? 'Video Call' : 'Voice Call'}
        open={call.open}
        onCancel={handleRefuse}
        width={400}
        footer={null}
      >
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center mb-5">
            <Avatar size={70} src={call.conversation?.image} />
            <h2 className="my-3 text-[20px] font-semibold text-center">
              {call.conversation?.title}
            </h2>
            <p className="text-[#777] text-center">
              Cuộc gọi sẽ bắt đầu ngay khi bạn chấp nhận
            </p>
          </div>
          <Space size={60} className="mx-auto">
            <Button
              type="default"
              shape="circle"
              icon={<IoClose size={22} />}
              size={'large'}
              className="bg-red-500 text-white border-none "
              onClick={handleRefuse}
            />
            <Button
              type="default"
              shape="circle"
              icon={
                call.type == CallTypes.VIDEO ? (
                  <IoVideocam size={22} />
                ) : (
                  <FaPhoneAlt size={18} />
                )
              }
              size={'large'}
              className="bg-green-500 text-white border-none "
              onClick={handleAccept}
            />
          </Space>
        </div>
      </Modal>
    </>
  );
};

export default CallModal;
