import { Avatar, Button, Flex, Image, Space, Typography } from 'antd';
import { GoDownload } from 'react-icons/go';
import pdf from '~/assets/pdf.png';
import useHover from '~/hooks/useHover';
import MessageAction from '~/section/chats/MessageAction';
import { useSelector } from '~/store';

import { memo, useState } from 'react';
import { formatDateTime } from '~/utils/formatDayTime';

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
    const [hoverRef, isHovering] = useHover();
    const [open, setOpen] = useState(false);

    return (
      <Flex vertical>
        {created && <TimeLine text={formatDateTime(created)} />}
        <Flex ref={hoverRef} justify={from === user.id ? 'end' : 'start'}>
          {from !== user.id && (
            <Avatar className="bg-[#fde3cf] text-[#f56a00] mr-2 cursor-pointer">
              B
            </Avatar>
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
              {forward && <ForwardMessage />}
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

export const MediaMessage = ({ from, image, created }) => {
  return (
    <MessageWrapper
      from={from}
      created={created}
      className="p-0 rounded-lg overflow-hidden"
    >
      <Image width={320} className="w-full" src={image} />
    </MessageWrapper>
  );
};

export const DocMessage = ({ from, text, created }) => {
  return (
    <MessageWrapper from={from} created={created}>
      <Flex align="center" justify="space-between" className="w-[260px]">
        <Flex align="center" gap={5}>
          <img src={pdf} className="w-[60px] h-[60px] " />{' '}
          <p className="font-semibold text-ellipsis text-nowrap overflow-hidden w-[150px]">
            {text}
          </p>
        </Flex>
        <Button
          type="text"
          shape="circle"
          icon={<GoDownload size={20} />}
          className="text-inherit"
        />
      </Flex>
    </MessageWrapper>
  );
};

export const TimeLine = ({ text }) => {
  return (
    <Flex justify="center" className="mb-3">
      <Flex className=" bg-black opacity-30 text-white px-4 py-1 rounded-[999px] text-[12px]">
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
      className="p-2 rounded-xl border border-solid border-gray-400"
      hideAction={true}
    >
      <Typography className="text-gray-500 italic">Message recalled</Typography>
    </MessageWrapper>
  );
};

const ForwardMessage = ({ id, sender, message }) => {
  return (
    <div className="border-l-4 border-r-0 border-t-0 border-b-0 border-blue-500 border-solid ps-2">
      <p className="text-xs font-semibold text-blue">Tran Nhat Sinh</p>
      <p className="text-xs text-gray-600">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Omnis,
        corporis!
      </p>
    </div>
  );
};
