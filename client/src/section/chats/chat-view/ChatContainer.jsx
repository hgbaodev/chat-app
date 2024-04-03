import { Flex } from 'antd';
import { ChatHeader } from './ChatHeader';
import { ChatFooter } from './ChatFooter';
import MesssageList from '~/section/chats/chat-view/MesssageList';
import ChangeNameConversationModal from '~/section/common/ChangeNameConversationModal';

export const ChatContainer = () => {
  return (
    <Flex vertical className="h-full flex-1">
      <ChatHeader />
      <MesssageList />
      <ChatFooter />
      <ChangeNameConversationModal />
    </Flex>
  );
};
