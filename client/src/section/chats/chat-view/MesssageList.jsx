import { Space, Spin } from 'antd';
import { useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  AudioMessage,
  CallMessage,
  DocMessage,
  MediaMessage,
  NameCardMessage,
  NewMessage,
  RecallMessage,
  TextMessage
} from '~/section/chats/chat-view/MessageTypes';
import { useDispatch, useSelector } from '~/store';
import { getMessagesOfConversation, setPage } from '~/store/slices/chatSlice';
import { MessageTypes } from '~/utils/enum';
import { LoadingOutlined } from '@ant-design/icons';

const MesssageList = () => {
  const dispatch = useDispatch();
  const { currentConversation, messages } = useSelector(
    (state) => state.chat.chat
  );

  useEffect(() => {
    if (currentConversation.id) {
      dispatch(
        getMessagesOfConversation({
          conversation_id: currentConversation.id,
          page: messages.currentPage
        })
      );
    }
  }, [currentConversation, dispatch, messages.currentPage]);

  const fetchMoreData = () => {
    setTimeout(() => {
      dispatch(setPage(messages.currentPage + 1));
    }, 1000);
  };

  return (
    <div
      className="p-4 pb-6 overflow-auto custom-scrollbar bg-gradient-to-b from-neutral-200 to-neutral-400"
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
        dataLength={messages.data.length}
        className="flex flex-col-reverse overflow-y-auto"
        next={fetchMoreData}
        inverse={true}
        hasMore={messages.currentPage < messages.lastPage}
        loader={
          <Spin
            className="p-2"
            indicator={<LoadingOutlined style={{ fontSize: 30 }} spin />}
          />
        }
        scrollableTarget="scrollableDiv"
      >
        <Space direction="vertical">
          {messages.data.map((message, index) => {
            let check = false;
            let showAvatar = true;
            if (index > 0) {
              const currentMessageTime = new Date(message.created_at);
              const prevMessageTime = new Date(
                messages.data[index - 1].created_at
              );
              const timeDiff = Math.abs(currentMessageTime - prevMessageTime);
              const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 30));
              if (hoursDiff >= 1) check = true;

              if (
                messages.data[index - 1].sender.id === message.sender.id &&
                messages.data[index - 1].message_type !== MessageTypes.NEWS &&
                !check
              )
                showAvatar = false;
            }

            switch (message.message_type) {
              case MessageTypes.TEXT:
                return (
                  <TextMessage
                    key={message.id}
                    {...message}
                    created={check ? message.created_at : null}
                    showAvatar={showAvatar}
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
              case MessageTypes.NEWS:
                return (
                  <NewMessage
                    key={message.id}
                    {...message}
                    created={check ? message.created_at : null}
                  />
                );
              case MessageTypes.NAMECARD:
                return (
                  <NameCardMessage
                    key={message.id}
                    {...message}
                    created={check ? message.created_at : null}
                  />
                );
              case MessageTypes.VIDEOCALL:
              case MessageTypes.VOICECALL:
                return (
                  <CallMessage
                    key={message.id}
                    {...message}
                    created={check ? message.created_at : null}
                    showAvatar={showAvatar}
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
