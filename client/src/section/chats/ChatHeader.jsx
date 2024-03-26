import { Badge, Button, Flex, Space, Typography } from 'antd';
import {
  SearchOutlined,
  ExclamationCircleOutlined,
  PhoneOutlined
} from '@ant-design/icons';
import { IoVideocamOutline } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { openCall } from '~/store/slices/chatSlice';
import { showMembersGroup, toggleContactInfo } from '~/store/slices/appSlice';
import { ConversationTypes } from '~/utils/enum';
import { v4 as uuidv4 } from 'uuid';
import AvatarImage from '~/section/users/AvatarImage';

export const ChatHeader = () => {
  const dispatch = useDispatch();
  const { contactInfo } = useSelector((state) => state.app);
  const { currentConversation } = useSelector((state) => state.chat.chat);
  const handleOpenContactInfo = () => {
    dispatch(toggleContactInfo());
  };

  // handle video call
  const handleVideoCall = () => {
    dispatch(openCall());
    localStorage.setItem(
      'call',
      JSON.stringify({
        calling: false,
        refused: false,
        ended: false,
        owner: true,
        conversation_id: currentConversation.id
      })
    );
    const peer_id = uuidv4();
    const width = 800;
    const height = 600;
    window.open(
      `/video-call/${peer_id}`,
      '_blank',
      `width=${width}, height=${600}, left=${
        (window.innerWidth - width) / 2
      }, top=${(window.innerHeight - height) / 2}`
    );
  };
  const handleOpenSharedMessages = () => dispatch(showMembersGroup());

  const getConversationInfo = () => {
    if (currentConversation.type == ConversationTypes.GROUP) {
      return (
        <span className="cursor-pointer" onClick={handleOpenSharedMessages}>
          {currentConversation.members.length} members
        </span>
      );
    } else return <span>Online</span>;
  };

  return (
    <Flex className="h-[60px] px-4" justify="space-between">
      <Space size="middle">
        <Badge size="default" dot={true} color="green" offset={[0, 28]}>
          <AvatarImage />
        </Badge>
        <Flex vertical justify="center">
          <Typography className="font-bold">
            {currentConversation.title}
          </Typography>
          <Typography className="text-xs">{getConversationInfo()}</Typography>
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
