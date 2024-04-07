import { Avatar, Button, Dropdown, Flex, Space, Typography } from 'antd';
import { useState } from 'react';
import { IoEllipsisHorizontal } from 'react-icons/io5';
import useHover from '~/hooks/useHover';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from '~/store';
import { setCurrentConversation } from '~/store/slices/chatSlice';

export const FriendItem = ({ id, avatar, fullName, email, conversation }) => {
  const [hoverRef, isHovering] = useHover();
  const [openOptions, setOpenOptions] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // handle
  const handleDeleteFriend = () => {
    // logic here
  };

  const handleShowFriendDetail = () => {
    // logic here
    console.log('Show friend detail', id);
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
      onClick={handleChatFriend}
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
        trigger={['click']}
        arrow={true}
        onOpenChange={(o) => setOpenOptions(o)}
        onClick={(e) => e.stopPropagation()}
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
