import {
  Avatar,
  Button,
  Dropdown,
  Flex,
  Space,
  Typography,
  message
} from 'antd';
import useHover from '~/hooks/useHover';
import { AiOutlineEllipsis } from 'react-icons/ai';
import { formatTimeAgo } from '~/utils/formatTimeAgo';
import { useDispatch } from '~/store';
import { setCurrentConversation } from '~/store/slices/chatSlice';

export const ContactItem = ({ id, title, image, lastestMessage, active }) => {
  const [hoverRef, isHovering] = useHover();

  const dispatch = useDispatch();

  const handleDeleteConversation = () => {
    message.success('Delete conversation successfully!');
  };

  const items = [
    {
      key: '1',
      label: <p className="m-0 min-w-[180px]">Pin this conversation</p>
    },
    {
      key: '2',
      label: <p className="m-0 w-[180px]">Mark as unread</p>
    },
    {
      key: '3',
      label: <p className="m-0 w-[180px]">Hide conversation</p>
    },
    {
      key: '4',
      label: (
        <p
          onClick={handleDeleteConversation}
          className="text-red-500 m-0 w-[180px]"
        >
          Delete conversation
        </p>
      )
    }
  ];

  // handle get all messages
  const getAllMessages = () => {
    dispatch(setCurrentConversation(id));
  };
  return (
    <Flex
      ref={hoverRef}
      className={`${
        active ? 'bg-blue-100' : 'bg-white hover:bg-neutral-100'
      } px-4 py-3 cursor-pointer`}
      align="center"
      justify="space-between"
      onClick={getAllMessages}
    >
      <Space className="flex-1">
        <Avatar size={42} src={image} />
        <Flex vertical justify="center">
          <Typography className="text-gray-700 font-semibold overflow-hidden whitespace-nowrap text-ellipsis max-w-[180px]">
            {title}
          </Typography>
          <Typography className="text-xs text-neutral-500 overflow-hidden whitespace-nowrap text-ellipsis max-w-[190px]">
            {lastestMessage?.message}
          </Typography>
        </Flex>
      </Space>
      <Dropdown
        menu={{ items }}
        placement="bottomLeft"
        className={`${isHovering ? 'block' : '!hidden'}`}
      >
        <Button
          type="text"
          size="small"
          icon={<AiOutlineEllipsis size={20} />}
        />
      </Dropdown>
      <Typography
        className={`${
          isHovering ? 'hidden' : 'block'
        } text-[10px] text-neutral-500`}
      >
        {formatTimeAgo(lastestMessage?.created_at)}
      </Typography>
    </Flex>
  );
};
