import { Avatar, Button, Modal, Space } from 'antd';
import { IoClose, IoVideocam } from 'react-icons/io5';
import { useSocket } from '~/hooks/useSocket';
import { useDispatch, useSelector } from '~/store';
import { setCall } from '~/store/slices/chatSlice';

const VideoCallModal = () => {
  const dispatch = useDispatch();
  const { emitAcceptVideoCall } = useSocket();
  const { call } = useSelector((state) => state.chat);
  // handle
  const handleClose = () => {
    dispatch(setCall({ open: false }));
  };
  const handleAccept = () => {
    localStorage.setItem(
      'call',
      JSON.stringify({ open: false, calling: true, owner: false })
    );
    window.open(`/video-call/${call.user.conversation_id}`, '_blank');
    emitAcceptVideoCall({ user_id: call.user.id });
  };
  // render
  return (
    <>
      <Modal
        title={'Video call'}
        open={call.open}
        onCancel={handleClose}
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
              onClick={handleClose}
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
