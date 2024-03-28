import { Avatar, Button, Modal, Space } from 'antd';
import { IoClose, IoVideocam } from 'react-icons/io5';
import { useSocket } from '~/hooks/useSocket';
import { useDispatch, useSelector } from '~/store';
import { setCall } from '~/store/slices/chatSlice';
import { v4 as uuidv4 } from 'uuid';

const VideoCallModal = () => {
  const dispatch = useDispatch();
  const { emitAcceptVideoCall, emitRefuseVideoCall } = useSocket();
  const { call } = useSelector((state) => state.chat);
  // handle

  const handleAccept = () => {
    dispatch(setCall({ open: false }));
    const peer_id = uuidv4();
    const width = 800;
    const height = 600;
    const leftPos = (window.innerWidth - width) / 2;
    const topPos = (window.innerHeight - height) / 2;
    window.open(
      `/video-call/${peer_id}?calling=true&refused=false&ended=false&owner=false&conversation_id=${
        call.user.conversation_id
      }&user=${JSON.stringify(call.user)}`,
      '_blank',
      `width=${width}, height=${height}, left=${leftPos}, top=${topPos}`
    );
    emitAcceptVideoCall({ user_id: call.user.id, peer_id });
  };

  // handle refuse
  const handleRefuse = () => {
    emitRefuseVideoCall({ user_id: call.user.id });
    dispatch(setCall({ open: false }));
  };
  // render
  return (
    <>
      <Modal
        title={'Video call'}
        open={call.open}
        onCancel={handleRefuse}
        width={400}
        footer={null}
      >
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center mb-5">
            <Avatar
              size={70}
              src={
                'https://res.cloudinary.com/dw3oj3iju/image/upload/v1709628794/chat_app/b6pswhnwsreustbzr8d0.jpg'
              }
            />
            <h2 className="my-3 text-[20px] font-semibold text-center">
              {call?.user?.full_name}
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
              icon={<IoVideocam size={22} />}
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

export default VideoCallModal;
