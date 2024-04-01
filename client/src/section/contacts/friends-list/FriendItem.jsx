import { Avatar, Button, Dropdown, Flex, Space, Typography } from 'antd';
import { useState } from 'react';
import { IoEllipsisHorizontal } from 'react-icons/io5';
import useHover from '~/hooks/useHover';


export const FriendItem = ({ id, avatar, fullName, email }) => {
  const [hoverRef, isHovering] = useHover();
  const [openOptions, setOpenOptions] = useState(false);
  // handle
  const handleDeleteFriend = () => {
    // logic here
  };

  const handleShowFriendDetail = () => {
    // logic here
    console.log('Show friend detail', id);
  };

  const handleChatFriend = () => {
    // logic here
    console.log('chat friend', id);
  };

  const dropdownItems = [
    {
      key: '1',
      label: 'Chat now',
      onClick: handleChatFriend
    },
    {
      key: '2',
      label: 'View profile',
      onClick: handleShowFriendDetail
    },
    {
      key: '3',
      label: 'Delete',
      onClick: handleDeleteFriend,
      danger: true
    }
  ];

  // render
  return (
    <Flex
      align="center"
      justify="space-between"
      className="w-full py-3 px-4 hover:bg-blue-50 cursor-pointer rounded"
      ref={hoverRef}
    >
      <Space align="center">
        <Avatar size={40} src={avatar} />
        <div>
          <Typography className="font-semibold">{fullName}</Typography>
          <p className="m-0 text-[13px] text-gray-500">{email}</p>
        </div>
      </Space>
      <Dropdown
        menu={{ items: dropdownItems }}
        placement="bottomLeft"
        className={`${isHovering || openOptions ? 'block' : '!hidden'}`}
        onOpenChange={(o) => setOpenOptions(o)}
        trigger={['click']}
        arrow={true}
      >
        <Button
          type="text"
          icon={<IoEllipsisHorizontal />}
          size="middle"
          className={openOptions && 'bg-slate-200'}
        />
      </Dropdown>
    </Flex>
  );
};
