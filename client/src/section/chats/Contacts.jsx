import { Input, Space } from "antd";
import Title from "antd/es/typography/Title";
import { ContactItem } from "./ContactItem";
import { SearchOutlined } from '@ant-design/icons';
export const Contacts = () => {
  return (
    <>
      <Title level={4} className="m-0">
        Chats
      </Title>
      <Input size="large" placeholder="Search" prefix={<SearchOutlined className="text-gray-400" />} />
      <Space direction="vertical" className="w-full my-4 h-[590px] overflow-y-auto scrollbar">
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
        <ContactItem />
        <ContactItem />
        <ContactItem />
        <ContactItem />
        <ContactItem />
      </Space>
    </>
  );
};
