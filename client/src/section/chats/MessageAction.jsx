import { Button, Dropdown, Flex, Popover, Space } from 'antd';
import { useState } from 'react';
import { FcDislike, FcLike, FcLinux, FcRating } from 'react-icons/fc';
import {
  IoArrowUndo,
  IoEllipsisVerticalSharp,
  IoHappyOutline
} from 'react-icons/io5';
import { useDispatch, useSelector } from '~/store';
import { deleteMessage, recallMessageRequest, setForwardMessage } from '~/store/slices/chatSlice';

const MessageAction = ({ messageId, from, ...props }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  const items = [
    {
      key: '1',
      label: (
        <p onClick={() => dispatch(setForwardMessage(messageId))}>Forward</p>
      )
    },
    {
      key: '2',
      label: 'Pin'
    },
    {
      key: '3',
      label: <p onClick={() => dispatch(recallMessageRequest(messageId))}>Recall</p>,
      danger: true
    },
    {
      key: '4',
      label: (
        <p onClick={() => dispatch(deleteMessage(messageId))}>
          Delete for me only
        </p>
      ),
      danger: true
    }
  ];

  const filteredItems =
    from !== user.id ? items.filter((item) => item.key != 3) : items;

  return (
    <Flex gap={6} {...props}>
      <Popover
        content={PopoverReaction}
        trigger="hover"
        arrow={false}
        overlayClassName="popover-reaction"
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
        open={open}
        onOpenChange={handleOpenChange}
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
