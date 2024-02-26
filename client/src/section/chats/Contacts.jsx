import { Button, Flex, Input, Space } from 'antd';
import { ContactItem } from './ContactItem';
import { SearchOutlined } from '@ant-design/icons';
import { MdOutlineGroupAdd, MdOutlinePersonAddAlt } from 'react-icons/md';
import { useState } from 'react';
import AddFriendsModal from '~/section/common/AddFriendsModal';

export const Contacts = ({ ...props }) => {
  return (
    <Flex className="h-screen" vertical {...props}>
      <ContactsHeader />
      <Space direction="vertical" className="overflow-y-auto scrollbar gap-0">
        <ContactItem active />
        <ContactItem />
        <ContactItem />
        <ContactItem />
        <ContactItem />
        <ContactItem />
        <ContactItem />
        <ContactItem />
        <ContactItem />
        <ContactItem />
        <ContactItem />
      </Space>
    </Flex>
  );
};

const ContactsHeader = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Space className="w-[100%] p-4">
        <Input
          variant="filled"
          placeholder="Search here..."
          prefix={<SearchOutlined />}
        />
        <Button
          type="text"
          icon={<MdOutlinePersonAddAlt size={20} />}
          onClick={() => setIsModalOpen(true)}
        />
        <Button type="text" icon={<MdOutlineGroupAdd size={20} />} />
      </Space>
      <AddFriendsModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
};
