import { Avatar, Button, Flex, Image, Space, Typography } from 'antd';
import { GoDownload } from 'react-icons/go';

import useHover from '~/hooks/useHover';
import MessageAction from '~/section/chats/chat-view/MessageAction';
import { useSelector } from '~/store';
import { memo, useState } from 'react';
import { formatDateTime } from '~/utils/formatDayTime';
import { formatFileSize } from '~/utils/formatFileSize';
import { getContentMessage, getIconDocument } from '~/utils/getPropertyMessage';
import { MessageTypes } from '~/utils/enum';
import { convertLinksToAnchorTags } from '~/utils/textProcessing';

const MessageWrapper = memo(
  ({
    messageId,
    from,
    forward,
    message_type,
    created = null,
    hideAction = false,
    children,
    isPinned,
    sender,
    showAvatar,
    ...props
  }) => {
    const { user } = useSelector((state) => state.auth);
    const [hoverRef, isHovering] = useHover();
    const [open, setOpen] = useState(false);

    return (
      <Flex vertical>
        {created && <TimeLine text={formatDateTime(created)} />}
        <Flex ref={hoverRef} justify={from === user.id ? 'end' : 'start'}>
          <Flex className="w-[40px]" style={{ display: 'block' }}>
            {from !== user.id && showAvatar && (
              <Avatar className="mr-2 cursor-pointer" src={sender?.avatar} />
            )}
          </Flex>
          <Flex
            align="center"
            gap={20}
            className={`${from !== user.id ? 'flex-1' : ''}`}
          >
            <Space
              className={`${
                from === user.id ? 'bg-[#c7e0ff] text-neutral-900' : 'bg-white'
              }  p-3 rounded-xl shadow-sm`}
              {...props}
              direction="vertical"
            >
              {forward &&
                message_type != MessageTypes.AUDIO &&
                message_type != MessageTypes.IMAGE && (
                  <ForwardMessage replyFrom={forward} isMe={from === user.id} />
                )}
              {children}
            </Space>
            {!hideAction && (
              <MessageAction
                className={`${
                  from === user.id ? '-order-last flex-row-reverse' : ''
                } ${isHovering || open ? 'visible' : 'invisible'}`}
                messageId={messageId}
                isPinned={isPinned}
                from={from}
                open={open}
                setOpen={setOpen}
              />
            )}
          </Flex>
        </Flex>
      </Flex>
    );
  }
);

export const TextMessage = ({
  id,
  sender,
  message,
  forward,
  created,
  is_pinned = false,
  ...props
}) => {
  return (
    <MessageWrapper
      messageId={id}
      from={sender.id}
      created={created}
      forward={forward}
      sender={sender}
      isPinned={is_pinned}
      {...props}
    >
      <Typography
        className="text-inherit"
        dangerouslySetInnerHTML={{ __html: convertLinksToAnchorTags(message) }}
      />
    </MessageWrapper>
  );
};

export const NewMessage = ({ message, created }) => {
  return (
    <Flex vertical>
      {created && <TimeLine text={formatDateTime(created)} />}
      <Flex justify="center" className="mb-3">
        <Flex className=" bg-black bg-opacity-30 text-white px-4 py-1 rounded-[999px] text-[12px]">
          {message}
        </Flex>
      </Flex>
    </Flex>
  );
};

export const MediaMessage = ({
  id,
  sender,
  attachments,
  forward,
  created,
  is_pinned = false,
  ...props
}) => {
  return (
    <MessageWrapper
      messageId={id}
      from={sender.id}
      created={created}
      forward={forward}
      className="p-0 rounded-lg overflow-hidden"
      isPinned={is_pinned}
      sender={sender}
      {...props}
    >
      <Image width={320} className="w-full" src={attachments.file_url} />
    </MessageWrapper>
  );
};

export const DocMessage = ({
  id,
  sender,
  attachments,
  forward,
  created,
  is_pinned = false,
  ...props
}) => {
  return (
    <MessageWrapper
      messageId={id}
      from={sender.id}
      created={created}
      forward={forward}
      isPinned={is_pinned}
      sender={sender}
      {...props}
    >
      <Flex align="center" justify="space-between" className="w-[300px]">
        <Flex align="center" gap={5}>
          <img
            src={getIconDocument(attachments.file_type)}
            className="w-[50px] h-[50px] "
          />
          <div>
            <p className="font-semibold text-ellipsis text-nowrap overflow-hidden max-w-[200px] text-sm">
              {attachments.file_name}
            </p>
            <p className="text-xs mt-2 text-gray-500">
              {formatFileSize(attachments.file_size)}
            </p>
          </div>
        </Flex>
        <Button
          type="text"
          shape="circle"
          icon={<GoDownload size={20} />}
          className="text-inherit"
          target="_blank"
          href={attachments.file_url}
        />
      </Flex>
    </MessageWrapper>
  );
};

export const TimeLine = ({ text }) => {
  return (
    <Flex justify="center" className="mb-3">
      <Flex className=" bg-black bg-opacity-30 text-white px-4 py-1 rounded-[999px] text-[12px]">
        {text}
      </Flex>
    </Flex>
  );
};

export const RecallMessage = ({ id, sender, created }) => {
  return (
    <MessageWrapper
      messageId={id}
      from={sender.id}
      created={created}
      sender={sender}
      hideAction={true}
    >
      <Typography className="text-gray-500 italic">Message recalled</Typography>
    </MessageWrapper>
  );
};

const ForwardMessage = ({ replyFrom, isMe }) => {
  const { message_type, sender, attachments } = replyFrom;
  return (
    <Flex
      gap="small"
      align="center"
      className={`cursor-pointer p-3 py-2 rounded-md ${
        isMe ? `bg-blue-300` : `bg-gray-100`
      }`}
    >
      <div className="h-10 w-[2px] bg-blue-500" />
      {message_type == MessageTypes.DOCUMENT && (
        <img
          src={getIconDocument(attachments.file_type)}
          className="w-[30px] h-[30px] "
        />
      )}
      {message_type == MessageTypes.IMAGE && (
        <img src={attachments.file_url} className="w-[40px] h-[40px] " />
      )}
      <Flex vertical>
        <p className="text-xs font-semibold text-blue mb-1">
          {sender.first_name + ' ' + sender.last_name}
        </p>
        <p className="text-xs text-gray-600">{getContentMessage(replyFrom)}</p>
      </Flex>
    </Flex>
  );
};

export const AudioMessage = ({
  id,
  sender,
  forward,
  created,
  attachments,
  is_pinned = false,
  ...props
}) => {
  return (
    <MessageWrapper
      messageId={id}
      from={sender.id}
      created={created}
      forward={forward}
      sender={sender}
      className="p-0 rounded-lg overflow-hidden"
      isPinned={is_pinned}
      {...props}
    >
      <audio controls>
        <source src={attachments?.file_url} type="audio/mpeg" />
      </audio>
    </MessageWrapper>
  );
};

export const NameCardMessage = ({
  id,
  sender,
  forward,
  created,
  namecard,
  is_pinned = false,
  ...props
}) => {
  return (
    <MessageWrapper
      messageId={id}
      from={sender.id}
      created={created}
      forward={forward}
      sender={sender}
      isPinned={is_pinned}
      {...props}
    >
      <Flex
        className={`py-2 cursor-pointer rounded`}
        align="center"
        justify="space-between"
      >
        <Space gap={12}>
          <Avatar size="large" src={namecard.avatar} />
          <Space direction="vertical" size={0}>
            <p className="m-0 text-sm">{`${namecard.first_name} ${namecard.last_name}`}</p>
            <p className="m-0 text-xs text-gray-500">{namecard.email}</p>
          </Space>
        </Space>
      </Flex>
    </MessageWrapper>
  );
};
