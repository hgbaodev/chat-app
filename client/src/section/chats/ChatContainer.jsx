import { Flex, Space } from 'antd';
import { ChatHeader } from './ChatHeader';
import { ChatFooter } from './ChatFooter';
import { TextMessage } from './MessageTypes';
import { useDispatch, useSelector } from '~/store';
import { useEffect, useRef } from 'react';
import { getMessagesOfConversation } from '~/store/slices/chatSlice';
import CustomLoader from '~/components/CustomLoader';
export const ChatContainer = () => {
  const dispatch = useDispatch();
  const { chat } = useSelector((state) => state.chat);

  const scrollRef = useRef(null);
  // effect
  useEffect(() => {
    if (chat.currentConversation.id) {
      dispatch(getMessagesOfConversation(chat.currentConversation.id));
    }
  }, [dispatch, chat.currentConversation]);

  console.table(chat.messages);

  // effect
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [scrollRef, chat.messages]);
  // render
  return (
    <Flex vertical className="h-full flex-1">
      <ChatHeader />
      <Space
        direction="vertical"
        className="p-4 overflow-y-auto custom-scrollbar"
        style={{
          height: 'calc(100vh - 120px)',
          boxShadow:
            '0px 2px 2px -2px rgba(0,0,0,.2), 0px -2px 2px -2px rgba(0,0,0,.2)'
        }}
        ref={scrollRef}
      >
        {chat.isLoading ? (
          <div className="w-full h-[calc(100vh-152px)]">
            <CustomLoader />
          </div>
        ) : (
          chat.messages.map((message, index) => {
            if (index < chat.messages.length - 1 && chat.messages.length >= 2) {
              const currentMessageTime = new Date(message.created_at);
              const nextMessageTime = new Date(
                chat.messages[index + 1].created_at
              );
              const timeDiff = Math.abs(nextMessageTime - currentMessageTime);
              const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));

              if (hoursDiff >= 1) {
                return <TextMessage key={message.id} {...message} created={message.created_at} />
              }
            }

            switch (message.message_type) {
              case 1:
                return <TextMessage key={message.id} {...message} />;
              default:
                return <span key={message.id}>123</span>;
            }
          })
        )}
      </Space>
      <ChatFooter />
    </Flex>
  );
};
