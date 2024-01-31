import { Button, Flex, Input, Space } from 'antd';
import { ContactItem } from './ContactItem';
import { SearchOutlined } from '@ant-design/icons';
import { MdOutlineGroupAdd, MdOutlinePersonAddAlt } from 'react-icons/md';
export const Contacts = () => {
  return (
    <Flex className="h-screen" vertical>
      <Space direction="vertical" className="w-[100%] p-4">
        <Flex justify="space-between" align="center">
          <h2 className="m-0">Chats</h2>
          <Space>
            <Button type="text" icon={<MdOutlinePersonAddAlt size={20} />} />
            {/* <Button type="text" icon={<MdOutlineGroupAdd size={20} />} /> */}
          </Space>
        </Flex>
        <Input
          size="large"
          variant="filled"
          placeholder="Search"
          className="text-sm rounded-full"
          prefix={<SearchOutlined className="text-gray-400" />}
        />
      </Space>
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
