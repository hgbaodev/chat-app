import { Button, Flex, Input } from 'antd';
import { IoIosLink } from 'react-icons/io';
import { IoSendSharp } from 'react-icons/io5';
export const ChatFooter = () => {
  return (
    <Flex className="h-[60px] p-3" align="center">
      <Button type="text" shape="circle" icon={<IoIosLink size={24} />} size="large" />
      <Input placeholder="Message..." className='h-full' />
      <Button type="text" shape="circle" icon={<IoSendSharp size={24} />} size="large" />
    </Flex>
  );
};
