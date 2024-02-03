import { Avatar, Button, Flex, Image, Typography } from 'antd';
import { GoDownload } from 'react-icons/go';
import pdf from '~/assets/pdf.png';
import useHover from '~/hooks/useHover';
import MessageAction from '~/section/chats/MessageAction';

export const MessageWrapper = ({ from, children, ...props }) => {
  const userId = '9999';
  const [hoverRef, isHovering] = useHover();
  return (
    <Flex ref={hoverRef} justify={from === userId ? 'end' : 'start'}>
      {from !== userId && (
        <Avatar className="bg-[#fde3cf] text-[#f56a00] mr-2 cursor-pointer">
          B
        </Avatar>
      )}
      <Flex align="center" gap={20}>
        <Flex
          className={`${
            from === userId ? 'bg-blue-500 text-white' : 'bg-gray-100'
          }  p-2 rounded-lg cursor-pointer`}
          {...props}
        >
          {children}
        </Flex>
        <MessageAction
          className={`${
            from === userId ? '-order-last flex-row-reverse' : ''
          } ${isHovering ? 'visible' : 'invisible'}`}
        />
      </Flex>
    </Flex>
  );
};

export const TextMessage = ({ from, text }) => {
  return (
    <MessageWrapper from={from}>
      <Typography className="text-inherit">{text}</Typography>
    </MessageWrapper>
  );
};
export const MediaMessage = ({ from, image }) => {
  return (
    <MessageWrapper from={from} className="p-0 rounded-lg overflow-hidden">
      <Image width={320} className="w-full" src={image} />
    </MessageWrapper>
  );
};

export const DocMessage = ({ from, doc, text }) => {
  return (
    <MessageWrapper from={from}>
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
