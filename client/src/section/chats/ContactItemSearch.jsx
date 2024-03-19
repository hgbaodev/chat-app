import {
  Avatar,
  Button,
  Dropdown,
  Flex,
  Space,
  Typography,
} from 'antd';
import useHover from '~/hooks/useHover';
import { AiOutlineEllipsis } from 'react-icons/ai';
import { useDispatch, useSelector } from '~/store';
import { setCurrentConversation } from '~/store/slices/chatSlice';

export const ContactItemSearch = ({ id, title, image, members, active }) => {
  const [hoverRef, isHovering] = useHover();
  const dispatch = useDispatch();
  const { currentConversation } = useSelector((state) => state.chat.chat);


  const items = [
    {
      key: '1',
      label: <p className="m-0 min-w-[180px]">Pin this conversation</p>
    },
    {
      key: '2',
      label: <p className="m-0 w-[180px]">Mark as unread</p>
    }
  ];

  // handle get all messages
  const getAllMessages = () => {
    if (currentConversation.id != id) {
      dispatch(setCurrentConversation({ id, title, image, members }));
    }
  };
  return (
    <Flex
      ref={hoverRef}
      className={`${
        active ? 'bg-blue-50' : 'bg-white hover:bg-neutral-100'
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
        </Flex>
      </Space>
      <Dropdown
        menu={{ items }}
        placement="bottomLeft"
        onClick={(e) => e.stopPropagation()}
        className={`${isHovering ? 'block' : '!hidden'}`}
      >
        <Button
          type="text"
          size="small"
          icon={<AiOutlineEllipsis size={20} />}
        />
      </Dropdown>
    </Flex>
  );
};
