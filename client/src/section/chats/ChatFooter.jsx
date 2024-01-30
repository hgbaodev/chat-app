import { Button, Flex, Input } from 'antd';
import { IoIosLink } from 'react-icons/io';
import { IoSendSharp } from 'react-icons/io5';
export const ChatFooter = () => {
  return (
    <Flex className="h-[60px] p-3" align="center" gap="small">
      <Button
        type="text"
        shape="circle"
        icon={<IoIosLink size={24} />}
        size="large"
        className="text-blue-500 hover:bg-blue-700"
      />
      <Input
        placeholder="Message..."
        className="h-full rounded-full bg-blue-50 border-none focus:shadow-none hover:bg-blue-100 focus:bg-blue-100"
      />
      <Button
        type="text"
        shape="circle"
        icon={<IoSendSharp size={30} />}
        size="large"
        className="text-blue-500 hover:text-blue-500"
      />
    </Flex>
  );
};
