import { Avatar, Button, Flex, Input, Modal, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Title from 'antd/es/typography/Title';
import { faker } from '@faker-js/faker';
import useHover from '~/hooks/useHover';
import { useMemo } from 'react';
import { IoCloseOutline } from 'react-icons/io5';

const AddFriendsModal = ({ isModalOpen, setIsModalOpen }) => {
  const handleClose = () => {
    setIsModalOpen(false);
  };
  return (
    <Modal
      title="Add friend"
      open={isModalOpen}
      onOk={handleClose}
      onCancel={handleClose}
      width={400}
    >
      <Space direction="vertical" className="w-[100%]">
        <Input
          name="input-search"
          placeholder="Enter email or phone"
          variant="filled"
          prefix={<SearchOutlined />}
          className="mt-2"
          autoComplete="nope"
        />
        <p className="text-xs text-gray-500">Recent searches</p>
        <div>
          <UserSearchItem />
          <UserSearchItem />
          <UserSearchItem />
          <UserSearchItem />
          <UserSearchItem />
          <UserSearchItem />
        </div>
      </Space>
    </Modal>
  );
};

const UserSearchItem = () => {
  const [hoverRef, isHovering] = useHover();
  const avatarSrc = useMemo(() => faker.image.avatar(), []);
  const fullName = useMemo(() => faker.person.fullName(), []);
  const email = useMemo(() => faker.internet.email(), []);
  return (
    <Flex
      ref={hoverRef}
      className="py-2 cursor-pointer"
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
      {isHovering && (
        <Button
          type="text"
          shape="circle"
          icon={<IoCloseOutline size={22} />}
        />
      )}
    </Flex>
  );
};

export default AddFriendsModal;
