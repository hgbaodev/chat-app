import { Avatar, Flex, Space, Typography } from 'antd';
import { faker } from '@faker-js/faker';
export const ContactItem = ({ active }) => {
  return (
    <Flex
      className={`${
        active ? 'bg-blue-100' : 'bg-white hover:bg-neutral-100'
      } px-4 py-3 cursor-pointer`}
      align="center"
      justify="space-between"
    >
      <Space className="flex-1">
        <Avatar className="bg-[#fde3cf] text-[#f56a00]" size={42}>
          {faker.person.fullName()[0].toUpperCase()}
        </Avatar>
        <Flex vertical justify="center">
          <Typography className="text-gray-700 font-semibold overflow-hidden whitespace-nowrap text-ellipsis max-w-[180px]">
            {faker.person.fullName()}
          </Typography>
          <Typography className="text-xs text-neutral-500 overflow-hidden whitespace-nowrap text-ellipsis max-w-[190px]">
            {faker.lorem.sentence()}
          </Typography>
        </Flex>
      </Space>
      <Typography className="text-[10px] text-neutral-500">
        {faker.date
          .anytime()
          .toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}
      </Typography>
    </Flex>
  );
};
