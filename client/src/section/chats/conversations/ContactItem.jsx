import {
  Avatar,
  Badge,
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
import { useDispatch, useSelector } from '~/store';
import {
  pinConversation,
  setCurrentConversation,
  unPinConversation
} from '~/store/slices/chatSlice';
import { ConversationTypes, MessageTypes } from '~/utils/enum';
import { useState } from 'react';
import AvatarGroup from '~/components/AvatarGroup';
import { showContactInfo } from '~/store/slices/appSlice';
import { GrPin } from 'react-icons/gr';

export const ContactItem = ({
  id,
  title,
  image,
  lastestMessage,
  type,
  members,
  active,
  is_pinned,
  admin,
}) => {
  const [hoverRef, isHovering] = useHover();
  const [openOptions, setOpenOptions] = useState(false);
  const dispatch = useDispatch();
  const { currentConversation } = useSelector((state) => state.chat.chat);
  const user = useSelector((state) => state.auth.user);

  const handleDeleteConversation = (e) => {
    e.stopPropagation();
    message.success('Delete conversation successfully!');
  };

  const handlePin = () => {
    if (!is_pinned) dispatch(pinConversation(id));
    else {
      dispatch(unPinConversation(id));
    }
  };

  const items = [
    {
      key: '1',
      label: (
        <p className="m-0 min-w-[180px]">
          {is_pinned ? 'Unpin this conversation' : 'Pin this conversation'}
        </p>
      ),
      onClick: handlePin
    },
    {
      key: '2',
      label: <p className="m-0 w-[180px]">Hide conversation</p>
    },
    {
      key: '3',
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
    if (currentConversation.id != id) {
      dispatch(
        setCurrentConversation({
          id,
          title,
          image,
          members,
          type,
          is_pinned,
          admin,
        })
      );
      dispatch(showContactInfo());
    }
  };

  const displayLastestMessage = ({ message_type, message, sender }) => {
    let name = user.id == sender.id ? 'You' : sender.last_name;
    if (message_type == MessageTypes.RECALL) {
      return `${name} unsent a message.`;
    } else if (message_type == MessageTypes.AUDIO) {
      return `${name} sent a voice message.`;
    } else if (message_type == MessageTypes.NAMECARD) {
      return `${name} sent a name card message.`;
    } else if (
      message_type == MessageTypes.IMAGE ||
      message_type == MessageTypes.DOCUMENT
    ) {
      return `${name} sent an attachment.`;
    } else if (message_type == MessageTypes.VIDEOCALL) {
      return `${name} made a video call.`;
    }
    return message;
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
        <Badge
          size="default"
          dot={members
            .filter((member) => member.id != user.id)
            .some((mem) => mem['status'] === true)}
          color="green"
          offset={[0, 40]}
        >
          {image == null && type === ConversationTypes.GROUP ? (
            <AvatarGroup users={members} />
          ) : (
            <Avatar size={50} src={image} />
          )}
        </Badge>

        <Flex vertical justify="center">
          <Typography className="text-slate-900 overflow-hidden whitespace-nowrap text-ellipsis max-w-[180px]">
            {title}
          </Typography>
          <Typography className="text-xs text-neutral-500 overflow-hidden whitespace-nowrap text-ellipsis max-w-[190px]">
            {displayLastestMessage(lastestMessage)}
          </Typography>
        </Flex>
      </Space>
      <Flex vertical>
        <>
          <Dropdown
            menu={{ items }}
            placement="bottomLeft"
            onClick={(e) => e.stopPropagation()}
            className={`${isHovering || openOptions ? 'block' : '!hidden'}`}
            onOpenChange={(o) => setOpenOptions(o)}
            trigger={['click']}
            arrow={true}
          >
            <Button
              type="text"
              size="small"
              className={openOptions && 'bg-slate-200'}
              icon={<AiOutlineEllipsis size={20} />}
            />
          </Dropdown>
          <Typography
            className={`${
              isHovering || openOptions ? 'hidden' : 'block'
            } text-[10px] text-neutral-500 pb-2`}
          >
            {formatTimeAgo(lastestMessage?.created_at)}
          </Typography>
        </>
        <Flex justify="end">{is_pinned && <GrPin size={15} />}</Flex>
      </Flex>
    </Flex>
  );
};
