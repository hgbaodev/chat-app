import { Avatar, Button, Flex } from 'antd';
import { IoCloseOutline } from 'react-icons/io5';
import { faker } from '@faker-js/faker';

export const FriendRequestItem = () => {
  return (
    <div className="bg-white p-4 rounded-md" style={{ boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px' }}>
      <Flex align="center" justify="space-between">
        <Flex align="center" gap={10}>
          <Avatar size={40} className="bg-[#fde3cf] text-[#f56a00]">
            {faker.person.fullName()[0].toUpperCase()}
          </Avatar>
          <div>
            <p className="my-1 font-semibold">{faker.person.firstName()}</p>
            <p className="m-0 text-[12px]">
              {faker.date.anytime().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}
            </p>
          </div>
        </Flex>
        <Button type="text" shape="circle" icon={<IoCloseOutline size={20} />} />
      </Flex>
      <div className="h-[60px] p-2  bg-gray-50 my-4 rounded border-[1px] border-gray-300 border-solid">
        <p className="m-0 line-clamp-2 text-ellipsis overflow-hidden">{faker.lorem.sentence()}</p>
      </div>
      <Flex align="center" justify="space-between">
        <Button className="w-[48%]">CANCEL</Button>
        <Button type='primary' className="w-[48%]">ACCEPT</Button>
      </Flex>
    </div>
  );
};
