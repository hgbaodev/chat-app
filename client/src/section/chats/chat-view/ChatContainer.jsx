import { Flex } from 'antd';
import { ChatHeader } from './ChatHeader';
import { ChatFooter } from './ChatFooter';
import MesssageList from '~/section/chats/chat-view/MesssageList';
import ChangeNameConversationModal from '~/section/common/ChangeNameConversationModal';
import PinnedMessages from '~/section/chats/chat-view/PinnedMessages';
import { useSelector } from '~/store';

export const ChatContainer = () => {
  const { isOpen } = useSelector((state) => state.chat.chat.pinned_messages);
  return (
    <Flex vertical className="h-full flex-1">
      {isOpen ? (
        <>
          <PinnedMessages />
        </>
      ) : (
        <>
          <ChatHeader />
          <MesssageList />
          <ChatFooter />
          <ChangeNameConversationModal />
        </>
      )}
    </Flex>
  );
};
