import { Flex } from 'antd';
import { ChatHeader } from './ChatHeader';
import { ChatFooter } from './ChatFooter';

export const ChatContainer = () => {
  return (
    <Flex vertical className="h-full">
      <ChatHeader />
      <Flex
        className="flex-1"
        style={{ boxShadow: '0px 2px 2px -2px rgba(0,0,0,.2), 0px -2px 2px -2px rgba(0,0,0,.2)' }}
      >
        123
      </Flex>
      <ChatFooter />
    </Flex>
  );
};
