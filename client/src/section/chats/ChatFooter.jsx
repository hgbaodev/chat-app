import { Button, Flex, Input } from 'antd';
import EmojiPicker from 'emoji-picker-react';
import { useState } from 'react';
import { IoIosLink } from 'react-icons/io';
import { IoHappyOutline, IoSendSharp } from 'react-icons/io5';
import { useSocket } from '~/hooks/useSocket';
import { useSelector } from '~/store';
const { TextArea } = Input;

export const ChatFooter = () => {
  const { chat } = useSelector((state) => state.chat);
  const { emitMessage } = useSocket();

  const [text, setText] = useState('');
  const [isOpenEmojiPicker, setOpenEmojiPicker] = useState(false);

  // handle
  const handleEmojiClick = (emoji) => {
    setText((pre) => pre + emoji.emoji);
  };

  // handle send message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (text.trim()) {
      emitMessage({
        conversation_id: chat.currentConversation.id,
        message: text,
        message_type: 1 // default
      });
      // reset text
      setText('');
    }
  };
  // render
  return (
    <form onSubmit={(e) => handleSendMessage(e)}>
      <Flex className="relative p-3" align="center" gap="small">
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
        <TextArea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Aa..."
          className="h-full rounded-3xl bg-neutral-100 border-none focus:shadow-none hover:bg-neutral-100 focus:bg-neutral-100"
          autoSize={{
            maxRows: 3
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage(e);
            }
          }}
        />
        <Button
          type="text"
          shape="circle"
          icon={<IoSendSharp size={20} />}
          size="large"
          className="text-blue-500 hover:text-blue-500"
          onClick={(e) => handleSendMessage(e)}
          disabled={!text.trim()}
        />
      </Flex>
    </form>
  );
};
