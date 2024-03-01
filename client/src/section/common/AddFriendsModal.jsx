import { Avatar, Button, Flex, Input, Modal, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import useHover from '~/hooks/useHover';
import { useState } from 'react';
import { IoAdd, IoChevronBack } from 'react-icons/io5';
import { __add_friend_mock__ } from '~/__mock__/add_friend';
import TextArea from 'antd/es/input/TextArea';

const AddFriendsModal = ({ isModalOpen, setIsModalOpen }) => {
  const [search, setSearch] = useState('');
  const [userSelected, setUserSelected] = useState(null);
  const [invitationMessage, setInvitationMessage] = useState('');
  // handle
  const handleClose = () => {
    setUserSelected(null);
    setIsModalOpen(false);
  };

  const handleSelectUser = (user_id) => {
    setUserSelected(__add_friend_mock__.find((item) => item.id === user_id));
    setInvitationMessage("Hello, I'm ...., Let's be friends!");
  };

  const handleResetSelectedUser = () => {
    setUserSelected(null);
  };

  const handleAddFriend = () => {
    console.log('call thunk action');
  };

  // render
  return (
    <Modal
      title={
        userSelected ? (
          <Flex align="center">
            <Button
              type="text"
              shape="circle"
              icon={<IoChevronBack size={22} />}
              onClick={handleResetSelectedUser}
              style={{ marginRight: 8 }}
            />
            Account Information
          </Flex>
        ) : (
          'Add friend'
        )
      }
      open={isModalOpen}
      onCancel={handleClose}
      width={400}
      footer={null}
    >
      {userSelected ? (
        <Space direction="vertical" className="w-[100%]">
          <Space gap={12}>
            <Avatar size="large" src={userSelected.avatarSr} />
            <Space direction="vertical" size={0}>
              <p className="m-0">{userSelected.fullName}</p>
              <p className="m-0 text-xs text-gray-500">{userSelected.email}</p>
            </Space>
          </Space>

          <TextArea
            rows={4}
            value={invitationMessage}
            onChange={(e) => {
              setInvitationMessage(e.target.value);
            }}
          />
          <Flex align="center" justify="end" gap={10}>
            <Button type="default" onClick={handleResetSelectedUser}>
              Cancel
            </Button>
            <Button type="primary" onClick={handleAddFriend}>
              Add friend
            </Button>
          </Flex>
        </Space>
      ) : (
        <Space direction="vertical" className="w-[100%]">
          <Input
            name="input-search"
            placeholder="Enter email or phone"
            variant="filled"
            prefix={<SearchOutlined />}
            className="mt-2"
            autoComplete="nope"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
          {search ? (
            <p className="text-xs text-gray-500">Recent searches</p>
          ) : (
            <p className="text-xs text-gray-500">Friendship suggestions</p>
          )}
          <div className="max-h-[420px] overflow-y-auto scrollbar">
            {__add_friend_mock__.map((item) => (
              <UserSearchItem
                key={item.id}
                avatarSrc={item.avatarSr}
                fullName={item.fullName}
                email={item.email}
                status={item.status}
                handleSelected={() => {
                  handleSelectUser(item.id);
                }}
              />
            ))}
          </div>
        </Space>
      )}
    </Modal>
  );
};

const UserSearchItem = ({
  avatarSrc,
  fullName,
  email,
  status,
  handleSelected
}) => {
  const [hoverRef, isHovering] = useHover();
  // handle
  const renderButton = () => {
    switch (status) {
      case 0:
        return (
          <Button
            type="primary"
            size="small"
            shape="circle"
            icon={<IoAdd size={22} />}
            onClick={handleSelected}
          />
        );
      case 1:
        return <p className="m-0">Friend</p>;
      case 2:
        return <p className="m-0">Pending</p>;
      default:
        return 0;
    }
  };
  return (
    <Flex
      ref={hoverRef}
      className={`py-2 cursor-pointer rounded ${isHovering && 'bg-gray-100'}`}
      align="center"
      justify="space-between"
    >
      <Space gap={12}>
        <Avatar size="large" src={avatarSrc} />
        <Space direction="vertical" size={0}>
          <p className="m-0">{fullName}</p>
          <p className="m-0 text-xs text-gray-500">{email}</p>
        </Space>
      </Space>
      {renderButton()}
    </Flex>
  );
};

export default AddFriendsModal;
