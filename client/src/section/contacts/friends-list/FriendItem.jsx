import { Avatar, Button, Dropdown, Flex, Space, Typography } from 'antd';
import { useState } from 'react';
import { IoEllipsisHorizontal } from 'react-icons/io5';
import useHover from '~/hooks/useHover';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from '~/store';
import { setCurrentConversation } from '~/store/slices/chatSlice';
import { setOpenProfile } from '~/store/slices/appSlice';

export const FriendItem = ({ id, avatar, fullName, conversation }) => {
  const [hoverRef, isHovering] = useHover();
  const [openOptions, setOpenOptions] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // handle
  const handleDeleteFriend = () => {
    // logic here
  };

  const handleShowFriendDetail = () => {
    dispatch(setOpenProfile(id));
  };

  const handleChatFriend = () => {
    navigate('/');
    dispatch(setCurrentConversation(conversation));
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
        <Typography className="font-semibold">{fullName}</Typography>
      </Space>
      <Dropdown
        menu={{ items: dropdownItems }}
        placement="bottomLeft"
        className={`${isHovering || openOptions ? 'block' : '!hidden'}`}
        trigger={['hover']}
        arrow={true}
        onOpenChange={(o) => setOpenOptions(o)}
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
