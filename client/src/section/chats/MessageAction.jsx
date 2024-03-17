import { Button, Dropdown, Flex, Popover, Space } from 'antd';
import { useState } from 'react';
import { FcDislike, FcLike, FcLinux, FcRating } from 'react-icons/fc';
import { GrPin } from 'react-icons/gr';
import {
  IoArrowUndo,
  IoEllipsisVerticalSharp,
  IoHappyOutline
} from 'react-icons/io5';
import { useDispatch } from '~/store';
import { deleteMessage } from '~/store/slices/chatSlice';

const MessageAction = ({ messageId, ...props }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  const items = [
    {
      key: '1',
      label: 'Forward',
      icon: <IoArrowUndo />
    },
    {
      key: '2',
      label: 'Pin',
      icon: <GrPin />
    },
    {
      key: '3',
      label: <p onClick={() => dispatch(deleteMessage(messageId))}>Recall</p>,
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
      />
      <Dropdown
        menu={{
          items
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
