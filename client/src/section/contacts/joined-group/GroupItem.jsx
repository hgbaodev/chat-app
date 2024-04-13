import { Avatar, Button, Dropdown, Flex, Space, Typography } from 'antd';
import { useState } from 'react';
import { IoEllipsisHorizontal } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from '~/store';
import { setCurrentConversation } from '~/store/slices/chatSlice';
import AvatarGroup from '~/components/AvatarGroup';

export const GroupItem = ({ group }) => {
  const { title, image, members } = group;
  const [openOptions, setOpenOptions] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDeleteFriend = () => {
    console.log('delete friend');
  };

  const handleChatFriend = () => {
    navigate('/');
    dispatch(setCurrentConversation(group));
  };

  const dropdownItems = [
    {
      key: '1',
      label: 'Chat now',
      onClick: handleChatFriend
    },
    {
      key: '3',
      label: 'Leave group',
      onClick: handleDeleteFriend,
      danger: true
    }
  ];

  // render
  return (
    <Flex
      align="center"
      justify="space-between"
      className="w-full py-2 px-4 hover:bg-neutral-100 cursor-pointer rounded"
      onClick={handleChatFriend}
    >
      <Space align="center">
        {image ? (
          <Avatar size={40} src={image} />
        ) : (
          <AvatarGroup users={members} />
        )}
        <div>
          <Typography className="font-semibold">{title}</Typography>
          <p className="m-0 text-[13px] text-gray-500">
            {members.length} members
          </p>
        </div>
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
