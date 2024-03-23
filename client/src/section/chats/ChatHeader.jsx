import { Avatar, Badge, Button, Flex, Space, Typography } from 'antd';
import {
  SearchOutlined,
  ExclamationCircleOutlined,
  PhoneOutlined
} from '@ant-design/icons';
import { IoVideocamOutline } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { toggleContactInfo } from '~/store/slices/appSlice';
import { openCall } from '~/store/slices/chatSlice';
export const ChatHeader = () => {
  const dispatch = useDispatch();
  const { contactInfo } = useSelector((state) => state.app);
  const { chat } = useSelector((state) => state.chat);
  // handle
  const handleOpenContactInfo = () => {
    dispatch(toggleContactInfo());
  };

  // handle video call
  const handleVideoCall = () => {
    dispatch(openCall());
    localStorage.setItem(
      'call',
      JSON.stringify({ calling: false, owner: true })
    );
    window.open(`/video-call/${chat.currentConversation.id}`, '_blank');
  };
  return (
    <Flex className="h-[60px] px-4" justify="space-between">
      <Space size="middle">
        <Badge size="default" dot={true} color="green" offset={[0, 28]}>
          <Avatar src={chat.currentConversation.image} size="large" />
        </Badge>
        <Flex vertical justify="center">
          <Typography className="font-bold">
            {chat.currentConversation.title}
          </Typography>
          <Typography className="text-[12px]">Online</Typography>
        </Flex>
      </Space>
      <Space size={18}>
        <Button
          type="text"
          shape="circle"
          icon={<IoVideocamOutline size={20} />}
          onClick={handleVideoCall}
        />
        <Button type="text" shape="circle" icon={<PhoneOutlined />} />
        <Button type="text" shape="circle" icon={<SearchOutlined />} />
        {!contactInfo.open && (
          <Button
            type="text"
            shape="circle"
            icon={<ExclamationCircleOutlined />}
            size={20}
            onClick={handleOpenContactInfo}
          />
        )}
      </Space>
    </Flex>
  );
};
