import { Button, Flex, Input } from 'antd';
import EmojiPicker from 'emoji-picker-react';
import { useState } from 'react';
import { IoIosLink } from 'react-icons/io';
import { IoHappyOutline, IoSendSharp } from 'react-icons/io5';
export const ChatFooter = () => {
  const [text, setText] = useState('');
  const [isOpenEmojiPicker, setOpenEmojiPicker] = useState(false);
  // handle
  const handleEmojiClick = (emoji) => {
    setText((pre) => pre + emoji.emoji);
  };

  // render
  return (
    <Flex className="relative h-[60px] p-3" align="center" gap="small">
      <Button
        type="text"
        shape="circle"
        icon={<IoIosLink size={24} />}
        size="large"
        className="text-blue-500 hover:bg-blue-700"
      />
      <Button
        type="text"
        shape="circle"
        icon={<IoHappyOutline size={24} />}
        size="large"
        className=" text-blue-500 hover:bg-blue-700"
        onClick={() => {
          setOpenEmojiPicker(!isOpenEmojiPicker);
        }}
      />
      {isOpenEmojiPicker && (
        <div className="absolute bottom-[60px] left-[60px] ">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}

      <Input
        value={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
        placeholder="Message..."
        className="h-full rounded-full bg-blue-50 border-none focus:shadow-none hover:bg-blue-100 focus:bg-blue-100"
      />
      <Button
        type="text"
        shape="circle"
        icon={<IoSendSharp size={20} />}
        size="large"
        className="text-blue-500 hover:text-blue-500"
      />
    </Flex>
  );
};
