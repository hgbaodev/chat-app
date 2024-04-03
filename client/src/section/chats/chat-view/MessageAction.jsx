import { Button, Dropdown, Flex, Popover, Space } from 'antd';
import { FcDislike, FcLike, FcLinux, FcRating } from 'react-icons/fc';
import {
  IoArrowUndo,
  IoEllipsisVerticalSharp,
  IoHappyOutline
} from 'react-icons/io5';
import { useDispatch, useSelector } from '~/store';
import {
  deleteMessage,
  pinMessage,
  recallMessageRequest,
  setForwardMessage,
  unpinMessage
} from '~/store/slices/chatSlice';
import {
  BsArrow90DegLeft,
  BsArrowClockwise,
  BsPin,
  BsTrash3
} from 'react-icons/bs';
import { RiUnpinLine } from 'react-icons/ri';

const MessageAction = ({ messageId, from, setOpen, isPinned, ...props }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { currentConversation } = useSelector((state) => state.chat.chat);

  const items = [
    {
      key: '1',
      label: 'Forward',
      onClick: () => dispatch(setForwardMessage(messageId)),
      icon: <BsArrow90DegLeft size={16} />
    },
    {
      key: '2',
      label: isPinned ? 'Unpin' : 'Pin',
      icon: isPinned ? <RiUnpinLine size={16} /> : <BsPin size={16} />,
      onClick: () => {
        if (isPinned) {
          dispatch(
            unpinMessage({
              conversation_id: currentConversation.id,
              message_id: messageId
            })
          );
        } else {
          dispatch(
            pinMessage({
              conversation_id: currentConversation.id,
              message_id: messageId
            })
          );
        }
      }
    },
    {
      key: '3',
      label: 'Recall',
      onClick: () => dispatch(recallMessageRequest(messageId)),
      icon: <BsArrowClockwise size={18} />,
      danger: true
    },
    {
      key: '4',
      label: 'Delete for me only',
      onClick: () => dispatch(deleteMessage(messageId)),
      icon: <BsTrash3 size={16} />,
      danger: true
    }
  ];

  const filteredItems =
    from !== user.id ? items.filter((item) => item.key != 3) : items;

  return (
    <Flex gap={6} {...props}>
      <Popover
        content={PopoverReaction}
        trigger="click"
        arrow={false}
        overlayClassName="popover-reaction"
        onOpenChange={(e) => setOpen(e)}
      >
        <Button
          type="text"
          size="small"
          shape="circle"
          icon={<IoHappyOutline size={18} />}
          className="text-gray-600 block"
        />
      </Popover>
      <Button
        type="text"
        size="small"
        shape="circle"
        icon={<IoArrowUndo size={18} />}
        className="text-gray-600"
        onClick={() => dispatch(setForwardMessage(messageId))}
      />
      <Dropdown
        menu={{
          items: filteredItems
        }}
        placement="topLeft"
        arrow={{
          pointAtCenter: true
        }}
        onOpenChange={(e) => setOpen(e)}
        trigger={['click']}
        className="min-w-[100px]"
      >
        <Button
          type="text"
          size="small"
          shape="circle"
          icon={<IoEllipsisVerticalSharp />}
          className="text-gray-600"
        />
      </Dropdown>
    </Flex>
  );
};

const PopoverReaction = () => {
  return (
    <Space>
      <Button
        type="text"
        size="small"
        shape="circle"
        icon={<FcLike size={18} />}
        className="text-gray-600"
      />
      <Button
        type="text"
        size="small"
        shape="circle"
        icon={<FcRating size={18} />}
        className="text-gray-600"
      />
      <Button
        type="text"
        size="small"
        shape="circle"
        icon={<FcLinux size={18} />}
        className="text-gray-600"
      />
      <Button
        type="text"
        size="small"
        shape="circle"
        icon={<FcDislike size={18} />}
        className="text-gray-600"
      />
      <Button
        type="text"
        size="small"
        shape="circle"
        icon={<IoArrowUndo size={18} />}
        className="text-gray-600"
      />
    </Space>
  );
};

export default MessageAction;
