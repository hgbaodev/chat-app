import { Avatar, Button, Dropdown, Flex, Space, Typography } from 'antd';
import { useState } from 'react';
import { IoEllipsisHorizontal } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from '~/store';
import { setCurrentConversation } from '~/store/slices/chatSlice';
import { deleteFriend, setOpenProfile } from '~/store/slices/relationshipSlice';

export const FriendItem = ({ id, avatar, fullName, conversation }) => {
  const [openOptions, setOpenOptions] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // handle
  const handleDeleteFriend = () => {
    dispatch(deleteFriend(id));
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
      className="w-full py-3 px-4 hover:bg-neutral-100 cursor-pointer rounded"
      onClick={handleChatFriend}
    >
      <Space align="center">
        <Avatar size={40} src={avatar} />
        <Typography className="font-semibold">{fullName}</Typography>
      </Space>
      <Dropdown
        menu={{
          items: dropdownItems,
          onClick: (e) => {
            e.domEvent.stopPropagation();
          }
        }}
        placement="bottomLeft"
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
