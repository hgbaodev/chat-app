import { Avatar, Button, Dropdown, Flex, Image, Typography } from 'antd';
import { GoDownload } from 'react-icons/go';
import { useState } from 'react';
import {
  IoArrowUndo,
  IoEllipsisVerticalSharp,
  IoHappyOutline
} from 'react-icons/io5';
import pdf from '~/assets/pdf.png';
import useHover from '~/hooks/useHover';

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

const items = [
  {
    key: '1',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="#">
        Delete
      </a>
    )
  },
  {
    key: '2',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="#">
        Forward
      </a>
    )
  },
  {
    key: '3',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="#">
        Pin
      </a>
    )
  }
];

const MessageAction = ({ ...props }) => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  return (
    <Flex gap={6} {...props}>
      <Button
        type="text"
        size="small"
        shape="circle"
        icon={<IoHappyOutline size={18} />}
        className="text-gray-600 block"
      />
      <Button
        type="text"
        size="small"
        shape="circle"
        icon={<IoArrowUndo size={18} />}
        className="text-gray-600"
      />
      <Dropdown
        menu={{
          items
        }}
        placement="topLeft"
        arrow={{
          pointAtCenter: true
        }}
        open={open}
        onOpenChange={handleOpenChange}
        className="min-w-[100px]"
      >
        <Button
          type="text"
          size="small"
          shape="circle"
          icon={<IoEllipsisVerticalSharp size={18} />}
          className="text-gray-600"
        />
      </Dropdown>
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
