import { Button, Dropdown, Flex, Input } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { IoIosLink } from 'react-icons/io';
import {
  IoCardOutline,
  IoDocumentAttachOutline,
  IoHappyOutline,
  IoImageOutline,
  IoMic,
  IoSendSharp
} from 'react-icons/io5';
import { useSocket } from '~/hooks/useSocket';
import { useSelector } from '~/store';
const { TextArea } = Input;
import { CloseOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { setForwardMessage } from '~/store/slices/chatSlice';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import RecordRTC from 'recordrtc';
import { formatTimeRecord } from '~/utils/formatDayTime';
import { FaTrash } from 'react-icons/fa';
import { MessageTypes } from '~/utils/enum';
import { blobToFile } from '~/utils/convertToBase64';
import useDebounce from '~/hooks/useDebounce';
import { getContentMessage, getIconDocument } from '~/utils/getPropertyMessage';

export const ChatFooter = () => {
  const dispatch = useDispatch();
  const { chat, forwardMessage } = useSelector((state) => state.chat);
  const { emitMessage, emitTypingIndicator } = useSocket();
  const [text, setText] = useState('');
  const [isOpenEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [isTyping, setTyping] = useState(false);
  const debouncedText = useDebounce(text, 1000);

  // handle
  const handleEmojiClick = (emoji) => {
    setText((pre) => pre + emoji.native);
  };

  // handle send message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (text.trim()) {
      emitMessage({
        conversation_id: chat.currentConversation.id,
        message: text,
        message_type: MessageTypes.TEXT,
        forward: forwardMessage?.id
      });
      setText('');
      dispatch(setForwardMessage(null));
    }
  };

  useEffect(() => {
    if (text !== debouncedText) {
      if (!isTyping) {
        emitTypingIndicator({
          conversation_id: chat.currentConversation.id,
          typing: true
        });
        setTyping(true);
      }
    } else {
      emitTypingIndicator({
        conversation_id: chat.currentConversation.id,
        typing: false
      });
      setTyping(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, debouncedText]);

  const handleChangeInput = (e) => {
    setText(e.target.value);
  };

  return (
    <div className="relative">
      {chat.typingIndicator &&
        chat.typingIndicator.conversation_id === chat.currentConversation.id &&
        chat.typingIndicator.typing === true && (
          <TypingMessage fullname={chat.typingIndicator?.fullname} />
        )}
      {forwardMessage && <ForwardMessage {...forwardMessage} />}
      <form onSubmit={(e) => handleSendMessage(e)}>
        <Flex className="relative p-3 " align="center" gap="small">
          <AttachmentInput />
          <Button
            type="text"
            shape="circle"
            icon={<IoHappyOutline size={20} />}
            size="middle"
            className=" text-blue-500 hover:bg-blue-700"
            onClick={(e) => {
              e.stopPropagation();
              setOpenEmojiPicker(!isOpenEmojiPicker);
            }}
          />
          {isOpenEmojiPicker && (
            <div className="absolute bottom-[60px] left-[60px]">
              <Picker
                data={data}
                onEmojiSelect={handleEmojiClick}
                onClickOutside={() => setOpenEmojiPicker(false)}
              />
            </div>
          )}
          <TextArea
            value={text}
            onChange={handleChangeInput}
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
          {text.trim() ? (
            <Button
              type="primary"
              shape="circle"
              icon={<IoSendSharp />}
              size="middle"
              className="text-white"
              onClick={(e) => handleSendMessage(e)}
            />
          ) : (
            <RecordButton />
          )}
        </Flex>
      </form>
    </div>
  );
};

const TypingMessage = ({ fullname }) => {
  return (
    <div className="absolute top-[-20px] left-0 bg-white text-xs px-4 py-1 rounded-tr-md flex items-center gap-2">
      <p>{fullname} is typing</p>
      <div className="flex gap-1">
        <div className="h-1 w-1 bg-slate-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="h-1 w-1 bg-slate-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="h-1 w-1 bg-slate-600 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
};

const AttachmentInput = () => {
  const { emitMessage } = useSocket();
  const inputFileRef = useRef(null);
  const dispatch = useDispatch();
  const [fileType, setFileType] = useState(null);
  const { chat, forwardMessage } = useSelector((state) => state.chat);
  const [messageType, setMessageType] = useState(MessageTypes.IMAGE);

  const handleDropdownItemClick = (type) => {
    if (type === 'photoOrVideo') {
      setMessageType(MessageTypes.IMAGE);
      setFileType('image/*,video/*');
    } else if (type === 'document') {
      setMessageType(MessageTypes.DOCUMENT);
      setFileType('.pdf,.doc,.docx,.xls,.xlsx');
    }
    setTimeout(() => {
      inputFileRef.current.value = null;
      inputFileRef.current.click();
    }, 0);
  };

  const handleFileInputChange = async (e) => {
    const selectedFiles = e.target.files;
    const fileArray = Array.from(selectedFiles);
    console.log(fileArray);
    fileArray.forEach((file) => {
      emitMessage({
        conversation_id: chat.currentConversation.id,
        attachment: file,
        message_type: messageType,
        forward: forwardMessage?.id
      });
    });
    dispatch(setForwardMessage(null));
  };

  useEffect(() => {
    if (fileType) {
      inputFileRef.current.setAttribute('accept', fileType);
    }
  }, [fileType]);
  return (
    <>
      <input
        type="file"
        ref={inputFileRef}
        style={{ display: 'none' }}
        accept={fileType}
        onChange={handleFileInputChange}
        multiple
      />
      <Dropdown
        menu={{
          items: [
            {
              key: '1',
              label: 'Photo or Video',
              icon: <IoImageOutline size={17} />,
              onClick: () => handleDropdownItemClick('photoOrVideo')
            },
            {
              key: '2',
              label: 'Document',
              icon: <IoDocumentAttachOutline size={16} />,
              onClick: () => handleDropdownItemClick('document')
              // disabled: true
            },
            {
              key: '3',
              label: 'Name card',
              icon: <IoCardOutline size={16} />,
              onClick: () => handleDropdownItemClick('document')
              // disabled: true
            }
          ]
        }}
        trigger={['click']}
      >
        <Button
          type="text"
          shape="circle"
          icon={<IoIosLink size={20} />}
          size="middle"
          className="text-blue-500 hover:bg-blue-700"
        />
      </Dropdown>
    </>
  );
};

const RecordButton = () => {
  const { emitMessage } = useSocket();
  const { chat, forwardMessage } = useSelector((state) => state.chat);
  const [isRecording, setRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [recordedTime, setRecordedTime] = useState(0);
  const [stream, setStream] = useState(null);
  const dispatch = useDispatch();

  const startRecording = async () => {
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });
      setStream(audioStream);
      const newRecorder = RecordRTC(audioStream, {
        type: 'audio',
        disableLogs: true
      });
      newRecorder.startRecording();
      setRecorder(newRecorder);
      setRecording(true);
      newRecorder.interval = setInterval(() => {
        setRecordedTime((prevTime) => prevTime + 0.1);
      }, 100);
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const stopRecording = () => {
    recorder.stopRecording(() => {
      const blob = recorder.getBlob();
      setRecording(false);
      clearInterval(recorder.interval);
      setRecordedTime(0);

      emitMessage({
        conversation_id: chat.currentConversation.id,
        attachment: blobToFile(blob, 'voice.webm'),
        message_type: MessageTypes.AUDIO,
        forward: forwardMessage?.id
      });
      dispatch(setForwardMessage(null));

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      recorder.destroy();
      setStream(null);
    });
  };

  const cancleRecord = () => {
    setRecording(false);
    clearInterval(recorder.interval);
    setRecordedTime(0);
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    recorder.destroy();
    setStream(null);
  };

  return !isRecording ? (
    <Button
      type="primary"
      shape="circle"
      icon={<IoMic size={20} />}
      size="middle"
      className="text-white"
      onClick={startRecording}
    />
  ) : (
    <>
      <Button
        type="primary"
        shape="circle"
        icon={<FaTrash />}
        size="middle"
        className="text-white"
        onClick={cancleRecord}
        danger
      />
      <Button
        type="primary"
        shape="round"
        icon={<IoSendSharp />}
        size="middle"
        className="text-white min-w-[122px]"
        onClick={stopRecording}
      >
        <span className="min-w-[60px]">{formatTimeRecord(recordedTime)}</span>
      </Button>
    </>
  );
};

const ForwardMessage = ({ message, sender, attachments, message_type }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  console.log(attachments, message_type);

  return (
    <Flex
      className="w-full px-4 pt-2"
      justify="space-between"
      gap={20}
      align="center"
    >
      <Flex className="flex-1" gap={10} align="center">
        <Flex
          gap="middle"
          className="rounded-md py-2 border-l-4 border-t-0 border-r-0 border-b-0 border-solid border-blue-500 ps-2 bg-blue-100 flex-1"
        >
          {message_type == MessageTypes.DOCUMENT && (
            <img
              src={getIconDocument(attachments[0].file_type)}
              className="w-[40px] h-[40px] "
            />
          )}
          {message_type == MessageTypes.IMAGE && (
            <img src={attachments[0].file_url} className="w-[40px] h-[40px] " />
          )}
          <Flex vertical>
            <p className="text-sm mb-[2px]">
              Replying to{' '}
              {`${sender.id === user.id ? 'yourself' : sender.last_name}`}
            </p>
            <p className="text-xs text-gray-500">
              {getContentMessage({ message, attachments, message_type })}
            </p>
          </Flex>
        </Flex>
      </Flex>
      <Button
        type="text"
        shape="circle"
        icon={<CloseOutlined className="text-gray-500" />}
        onClick={() => dispatch(setForwardMessage(null))}
      />
    </Flex>
  );
};
