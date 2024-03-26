import { Avatar, Button, Flex, Image, Space, Typography } from 'antd';
import { GoDownload } from 'react-icons/go';
import pdf from '~/assets/pdf_icon.svg';
import word from '~/assets/word_icon.svg';
import excel from '~/assets/excel_icon.svg';
import useHover from '~/hooks/useHover';
import MessageAction from '~/section/chats/MessageAction';
import { useSelector } from '~/store';
import { memo, useState } from 'react';
import { formatDateTime } from '~/utils/formatDayTime';
import { formatFileSize } from '~/utils/formatFileSize';

const MessageWrapper = memo(
  ({
    messageId,
    from,
    forward,
    created = null,
    hideAction = false,
    children,
    ...props
  }) => {
    const { user } = useSelector((state) => state.auth);
    const { chat } = useSelector((state) => state.chat);

    const [hoverRef, isHovering] = useHover();
    const [open, setOpen] = useState(false);

    return (
      <Flex vertical>
        {created && <TimeLine text={formatDateTime(created)} />}
        <Flex ref={hoverRef} justify={from === user.id ? 'end' : 'start'}>
          {from !== user.id && (
            <Avatar
              className="mr-2 cursor-pointer"
              src={
                chat.currentConversation.members.find((mem) => mem.id == from)[
                  'avatar'
                ]
              }
            />
          )}
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
              {forward && <ForwardMessage replyFrom={forward} />}
              {children}
            </Space>
            {!hideAction && (
              <MessageAction
                className={`${
                  from === user.id ? '-order-last flex-row-reverse' : ''
                } ${isHovering || open ? 'visible' : 'invisible'}`}
                messageId={messageId}
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

export const TextMessage = ({ id, sender, message, forward, created }) => {
  return (
    <MessageWrapper
      messageId={id}
      from={sender.id}
      created={created}
      forward={forward}
    >
      <Typography className="text-inherit">{message}</Typography>
    </MessageWrapper>
  );
};

export const MediaMessage = ({ id, sender, attachments, forward, created }) => {
  return (
    <MessageWrapper
      messageId={id}
      from={sender.id}
      created={created}
      forward={forward}
      className="p-0 rounded-lg overflow-hidden"
    >
      <Image width={320} className="w-full" src={attachments[0].file_url} />
    </MessageWrapper>
  );
};

const getIcon = (type) => {
  if (type == 'xlsx' || type == 'xls') return excel;
  if (type == 'pdf') return pdf;
  if (type == 'doc' || type == 'docx') return word;
};

export const DocMessage = ({ id, sender, attachments, forward, created }) => {
  return (
    <MessageWrapper
      messageId={id}
      from={sender.id}
      created={created}
      forward={forward}
    >
      <Flex align="center" justify="space-between" className="w-[300px]">
        <Flex align="center" gap={5}>
          <img
            src={getIcon(attachments[0].file_type)}
            className="w-[50px] h-[50px] "
          />
          <div>
            <p className="font-semibold text-ellipsis text-nowrap overflow-hidden max-w-[200px] text-sm">
              {attachments[0].file_name}
            </p>
            <p className="text-xs mt-2 text-gray-500">
              {formatFileSize(attachments[0].file_size)}
            </p>
          </div>
        </Flex>
        <Button
          type="text"
          shape="circle"
          icon={<GoDownload size={20} />}
          className="text-inherit"
          href={attachments[0].file_url}
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
      hideAction={true}
    >
      <Typography className="text-gray-500 italic">Message recalled</Typography>
    </MessageWrapper>
  );
};

const ForwardMessage = ({ replyFrom }) => {
  const { message, sender } = replyFrom;
  return (
    <div className="border-l-4 border-r-0 border-t-0 border-b-0 border-blue-500 border-solid ps-2 cursor-pointer">
      <p className="text-xs font-semibold text-blue mb-1">
        {sender.first_name + ' ' + sender.last_name}
      </p>
      <p className="text-xs text-gray-600">{message}</p>
    </div>
  );
};

export const AudioMessage = ({ id, sender, forward, created, attachments }) => {
  return (
    <MessageWrapper
      messageId={id}
      from={sender.id}
      created={created}
      forward={forward}
      className="p-0 rounded-lg overflow-hidden"
    >
      <audio controls>
        <source src={attachments[0]?.file_url} type="audio/mpeg" />
      </audio>
    </MessageWrapper>
  );
};
