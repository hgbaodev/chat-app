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
