import { Flex, Space } from 'antd';
import { ChatHeader } from './ChatHeader';
import { ChatFooter } from './ChatFooter';
import { TextMessage } from './MessageTypes';
import { useDispatch, useSelector } from '~/store';
import { useEffect } from 'react';
import { getMessagesOfConversation } from '~/store/slices/chatSlice';
import Loader from '~/components/Loader';
export const ChatContainer = () => {
  const dispatch = useDispatch();
  const { chat } = useSelector((state) => state.chat);

  // effect
  useEffect(() => {
    if (chat.currentConversation) {
      dispatch(getMessagesOfConversation(chat.currentConversation));
    }
  }, [dispatch, chat.currentConversation]);

  // render
  return (
    <Flex vertical className="h-full flex-1">
      <ChatHeader />
      <Space
        direction="vertical"
        className="p-4 overflow-y-auto "
        style={{
          height: 'calc(100vh - 120px)',
          boxShadow:
            '0px 2px 2px -2px rgba(0,0,0,.2), 0px -2px 2px -2px rgba(0,0,0,.2)'
        }}
      >
        {chat.isLoading ? (
          <Loader />
        ) : (
          chat.messages.map((message) => {
            switch (message.message_type) {
              case 1:
                return <TextMessage key={message.id} {...message} />;
              default:
                return <>123</>;
            }
          })
        )}
      </Space>
      <ChatFooter />
    </Flex>
  );
};
