import { Button, Dropdown, Flex, Popover, Space } from 'antd';
import { useState } from 'react';
import { FcDislike, FcLike, FcLinux, FcRating } from 'react-icons/fc';
import {
  IoArrowUndo,
  IoEllipsisVerticalSharp,
  IoHappyOutline
} from 'react-icons/io5';

const items = [
  {
    key: '1',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="#">
        Delete
      </a>
    )
  },
  {
    key: '2',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="#">
        Forward
      </a>
    )
  },
  {
    key: '3',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="#">
        Pin
      </a>
    )
  }
];

const MessageAction = ({ ...props }) => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

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
        className="min-w-[100px]"
      >
        <Button
          type="text"
          size="small"
          shape="circle"
          icon={<IoEllipsisVerticalSharp size={18} />}
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
