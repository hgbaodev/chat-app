import { Avatar, Button, Flex } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { faker } from '@faker-js/faker';

export const FriendRequestItem = () => {
  return (
    <div className="bg-blue-100 p-4 rounded-md">
      <Flex align="center" justify="space-between">
        <Flex align="center" gap={10}>
          <Avatar className="bg-[#fde3cf] text-[#f56a00]">{faker.person.fullName()[0].toUpperCase()}</Avatar>
          <div>
            <p className="my-1 font-semibold">{faker.person.firstName()}</p>
            <p className="m-0 text-[12px]">
              {faker.date.anytime().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}
            </p>
          </div>
        </Flex>
        <Button type="text" shape="circle" icon={<SearchOutlined />} />
      </Flex>
    </div>
  );
};
