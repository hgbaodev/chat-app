import { Avatar, Button, Flex, Input, Modal, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { faker } from '@faker-js/faker';
import useHover from '~/hooks/useHover';
import { useMemo } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import UserSearchItem from '~/section/common/UserSearchItem';

const AddGroupModal = ({ isModalOpen, setIsModalOpen }) => {
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


export default AddGroupModal;
