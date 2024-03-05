import { Avatar, Button, Dropdown, Flex, Space, Typography } from 'antd';
import { IoEllipsisHorizontal } from 'react-icons/io5';
const ACTIONS = {
  CHAT: 'Chat now',
  VIEW_DETAILS: 'View details',
  DELETE: 'Delete'
};

const FriendDropdownItem = ({ action, onClick }) => (
  <p
    onClick={onClick}
    className={`m-0 p-1 ${action === ACTIONS.DELETE ? 'text-red-500' : ''}`}
  >
    {action}
  </p>
);

export const FriendItem = ({ id, avatar, fullName, email }) => {
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
      label: (
        <FriendDropdownItem action={ACTIONS.CHAT} onClick={handleChatFriend} />
      )
    },
    {
      key: '2',
      label: (
        <FriendDropdownItem
          action={ACTIONS.VIEW_DETAILS}
          onClick={handleShowFriendDetail}
        />
      )
    },
    {
      key: '3',
      label: (
        <FriendDropdownItem
          action={ACTIONS.DELETE}
          onClick={handleDeleteFriend}
        />
      )
    }
  ];

  // render
  return (
    <Flex
      align="center"
      justify="space-between"
      className="w-full py-3 px-4 hover:bg-blue-50 cursor-pointer rounded"
    >
      <Space align="center">
        <Avatar size={40} src={avatar} />
        <div>
          <Typography className="font-semibold">{fullName}</Typography>
          <p className="m-0 text-[13px] opacity-70">{email}</p>
        </div>
      </Space>
      <Dropdown menu={{ items: dropdownItems }} placement="bottomLeft">
        <Button
          type="text"
          icon={<IoEllipsisHorizontal />}
          size="middle"
          className="text-gray-500"
        />
      </Dropdown>
    </Flex>
  );
};
