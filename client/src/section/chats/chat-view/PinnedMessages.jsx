import { Button, Flex, Space, Typography } from 'antd';
import { useEffect } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import {
  AudioMessage,
  DocMessage,
  MediaMessage,
  NameCardMessage,
  TextMessage
} from '~/section/chats/chat-view/MessageTypes';
import { useDispatch, useSelector } from '~/store';
import {
  getPinnedMessages,
  setOpenPinnedMessage
} from '~/store/slices/chatSlice';
import { MessageTypes } from '~/utils/enum';
const PinnedMessages = () => {
  return (
    <>
      <Header />
      <MesssageList />
    </>
  );
};

const Header = () => {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.chat.chat.pinned_messages);
  const handleClose = () => dispatch(setOpenPinnedMessage(false));
  return (
    <Flex className="h-[60px] px-4" justify="space-between">
      <Space size="middle">
        <Button
          icon={<IoArrowBack size={20} />}
          shape="circle"
          type="text"
          onClick={handleClose}
        />
        <Flex vertical justify="center">
          <Typography className="font-semibold">
            {data.length} Pinned Messages
          </Typography>
        </Flex>
      </Space>
    </Flex>
  );
};

const MesssageList = () => {
  const dispatch = useDispatch();
  const { currentConversation, pinned_messages } = useSelector(
    (state) => state.chat.chat
  );

  useEffect(() => {
    if (currentConversation.id) {
      dispatch(getPinnedMessages(currentConversation.id));
    }
  }, [dispatch, currentConversation]);

  return (
    <div
      className="p-4 pb-6 overflow-auto custom-scrollbar bg-gradient-to-b from-neutral-200 to-neutral-400"
      style={{
        height: 'calc(100vh - 60px)',
        boxShadow:
          '0px 1px 1px -1px rgba(0,0,0,.1), 0px -1px 1px -1px rgba(0,0,0,.1)',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column-reverse'
      }}
    >
      <Space direction="vertical">
        {pinned_messages.data.map((message, index) => {
          let check = false;
          let showAvatar = true;
          if (index > 0) {
            const currentMessageTime = new Date(message.created_at);
            const prevMessageTime = new Date(
              pinned_messages.data[index - 1].created_at
            );
            const timeDiff = Math.abs(currentMessageTime - prevMessageTime);
            const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 30));
            if (hoursDiff >= 1) check = true;

            if (
              pinned_messages.data[index - 1].sender.id === message.sender.id &&
              pinned_messages.data[index - 1].message_type !== MessageTypes.NEWS
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
            case MessageTypes.NAMECARD:
              return (
                <NameCardMessage
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
    </div>
  );
};

export default PinnedMessages;
