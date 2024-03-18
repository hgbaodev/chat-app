import { Flex } from 'antd';
import { ChatHeader } from './ChatHeader';
import { ChatFooter } from './ChatFooter';
import MesssageList from '~/section/chats/MesssageList';

export const ChatContainer = () => {
  return (
    <Flex vertical className="h-full flex-1">
      <ChatHeader />
      <MesssageList />
      <ChatFooter />
    </Flex>
  );
};
