import { Avatar, Button, Flex, Input, Modal, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import useHover from '~/hooks/useHover';
import { useState } from 'react';
import { IoAdd } from 'react-icons/io5';
import { __add_friend_mock__ } from '~/__mock__/add_friend';

const AddFriendsModal = ({ isModalOpen, setIsModalOpen }) => {
  const [search, setSearch] = useState('');
  const handleClose = () => {
    setIsModalOpen(false);
  };
  return (
    <Modal
      title="Add friend"
      open={isModalOpen}
      onCancel={handleClose}
      width={400}
      footer={null}
    >
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
            />
          ))}
        </div>
      </Space>
    </Modal>
  );
};

const UserSearchItem = ({ avatarSrc, fullName, email, status }) => {
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
