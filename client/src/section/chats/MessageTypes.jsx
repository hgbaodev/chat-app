import { Avatar, Button, Flex, Image, Typography } from 'antd';
import { GoDownload } from 'react-icons/go';
import pdf from '~/assets/pdf.png';
import useHover from '~/hooks/useHover';
import MessageAction from '~/section/chats/MessageAction';
import { useSelector } from '~/store';

import { memo } from 'react';
import { formatDateTime } from '~/utils/formatDayTime';

const MessageWrapper = memo(({ from, created = null, children, ...props }) => {
  const { user } = useSelector((state) => state.auth);
  const [hoverRef, isHovering] = useHover();
  return (
    <Flex vertical>
      {created && (
        <Typography.Text code className="text-center py-2">
          {formatDateTime(created)}
        </Typography.Text>
      )}
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
          <Flex
            className={`${
              from === user.id ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }  p-2 rounded-lg cursor-pointer`}
            {...props}
          >
            {children}
          </Flex>
          <MessageAction
            className={`${
              from === user.id ? '-order-last flex-row-reverse' : ''
            } ${isHovering ? 'visible' : 'invisible'}`}
          />
        </Flex>
      </Flex>
    </Flex>
  );
});

export default MessageWrapper;

export const TextMessage = ({ sender, message, created }) => {
  return (
    <MessageWrapper from={sender.id} created={created}>
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
    <Flex justify="center">
      <Flex className=" bg-gray-100 px-4 py-1 rounded-[999px] text-[12px]">
        {text}
      </Flex>
    </Flex>
  );
};
