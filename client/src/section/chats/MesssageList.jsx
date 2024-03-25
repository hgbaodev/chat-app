import { Space, Spin } from 'antd';
import { useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  AudioMessage,
  DocMessage,
  MediaMessage,
  RecallMessage,
  TextMessage
} from '~/section/chats/MessageTypes';
import { useDispatch, useSelector } from '~/store';
import { getMessagesOfConversation, setPage } from '~/store/slices/chatSlice';
import { MessageTypes } from '~/utils/enum';
const MesssageList = () => {
  const dispatch = useDispatch();
  const { chat } = useSelector((state) => state.chat);

  useEffect(() => {
    if (chat.currentConversation.id) {
      dispatch(
        getMessagesOfConversation({
          conversation_id: chat.currentConversation.id,
          page: chat.currentPage
        })
      );
    }
  }, [dispatch, chat.currentConversation, chat.currentPage]);

  const fetchMoreData = () => {
    setTimeout(() => {
      dispatch(setPage(chat.currentPage + 1));
    }, 1000);
  };

  return (
    <div
      className="p-4 overflow-auto custom-scrollbar bg-gradient-to-b from-neutral-200 to-neutral-400"
      style={{
        height: 'calc(100vh - 120px)',
        boxShadow:
          '0px 1px 1px -1px rgba(0,0,0,.1), 0px -1px 1px -1px rgba(0,0,0,.1)',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column-reverse'
      }}
      id="scrollableDiv"
    >
      <InfiniteScroll
        dataLength={chat.messages.length}
        className="flex flex-col-reverse overflow-y-auto"
        next={fetchMoreData}
        inverse={true}
        hasMore={chat.currentPage < chat.lastPage}
        loader={<Spin className="py-2" />}
        scrollableTarget="scrollableDiv"
      >
        <Space direction="vertical">
          {chat.messages.map((message, index) => {
            let check = false;
            if (index > 0) {
              const currentMessageTime = new Date(message.created_at);
              const prevMessageTime = new Date(
                chat.messages[index - 1].created_at
              );
              const timeDiff = Math.abs(currentMessageTime - prevMessageTime);
              const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
              if (hoursDiff > 1) check = true;
            }

            switch (message.message_type) {
              case MessageTypes.TEXT:
                return (
                  <TextMessage
                    key={message.id}
                    {...message}
                    created={check ? message.created_at : null}
                  />
                );
              case MessageTypes.AUDIO:
                return (
                  <AudioMessage
                    key={message.id}
                    {...message}
                    created={check ? message.created_at : null}
                  />
                );
              case MessageTypes.RECALL:
                return (
                  <RecallMessage
                    key={message.id}
                    {...message}
                    created={check ? message.created_at : null}
                  />
                );
              case MessageTypes.DOCUMENT:
                return (
                  <DocMessage
                    key={message.id}
                    {...message}
                    created={check ? message.created_at : null}
                  />
                );
              case MessageTypes.IMAGE:
                return (
                  <MediaMessage
                    key={message.id}
                    {...message}
                    created={check ? message.created_at : null}
                  />
                );
              default:
                return null;
            }
          })}
        </Space>
      </InfiniteScroll>
    </div>
  );
};

export default MesssageList;
