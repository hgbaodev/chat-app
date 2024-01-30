import { Avatar, Flex, Image, Typography } from 'antd';

export const MessageWrapper = ({ from, children }) => {
  const userId = '9999';
  return (
    <Flex justify={from === userId ? 'end' : 'start'}>
      {from !== userId && <Avatar className="bg-[#fde3cf] text-[#f56a00] mr-2">B</Avatar>}
      <Flex className={`${from === userId ? 'bg-blue-500 text-white' : 'bg-gray-100'}  p-2 rounded-lg max-w-[45%]`}>
        {children}
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
    <MessageWrapper from={from}>
      <Image width={320} className="w-full" src={image} />
    </MessageWrapper>
  );
};

export const TimeLine = ({ text }) => {
  return (
    <Flex justify="center">
      <Flex className=" bg-gray-100 px-4 py-1 rounded-[999px] text-[12px]">{text}</Flex>
    </Flex>
  );
};
