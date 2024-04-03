import { Button, Col, Empty, Flex, Grid, Image, Row, Tabs } from 'antd';
import { IoArrowBackSharp } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { showContactInfo } from '~/store/slices/appSlice';
import { GoDownload } from 'react-icons/go';
import { useSelector } from '~/store';
import { useEffect } from 'react';
import { getAttachments } from '~/store/slices/chatSlice';
import { MessageTypes } from '~/utils/enum';
import { getIconDocument } from '~/utils/getPropertyMessage';
import { formatFileSize } from '~/utils/formatFileSize';
const { useBreakpoint } = Grid;

export const SharedMessages = () => {
  const dispatch = useDispatch();
  const screens = useBreakpoint();
  // handle
  const handleReturnContactInfo = () => {
    dispatch(showContactInfo());
  };
  const items = [
    {
      key: '1',
      label: 'Media',
      children: <Media />
    },
    {
      key: '2',
      label: 'Docs',
      children: <Docs />
    }
  ];

  // render
  return (
    <Flex
      vertical
      className={`w-[350px] ${
        !screens.xl ? 'absolute bg-white right-0 bottom-0 top-0 border-l' : ''
      }`}
      style={{ boxShadow: '0px 0px 2px rgba(0,0,0,.1)' }}
    >
      <Flex
        gap={10}
        align="center"
        className="w-full h-[60px] px-4"
        style={{ boxShadow: '0px 0px 2px rgba(0,0,0,.1)' }}
      >
        <Button
          type="text"
          shape="circle"
          icon={<IoArrowBackSharp size={18} />}
          size={20}
          onClick={handleReturnContactInfo}
        />
        <p className="m-0 font-semibold">Media, files and links</p>
      </Flex>

      <Flex className="p-4">
        <Tabs centered items={items} className="w-full" />
      </Flex>
    </Flex>
  );
};

export const Media = () => {
  const dispatch = useDispatch();
  const { attachments, currentConversation } = useSelector(
    (state) => state.chat.chat
  );

  useEffect(() => {
    dispatch(
      getAttachments({
        conversation_id: currentConversation.id,
        type: MessageTypes.IMAGE
      })
    );
  }, [currentConversation, dispatch]);

  return (
    <Row gutter={[8, 8]}>
      {attachments.images.length > 0 ? (
        attachments.images.map((image) => (
          <Col span={8} key={image.id}>
            <Image
              src={image.file_url}
              className="rounded-md overflow-hidden cursor-pointer object-cover"
              preview={{ mask: false }}
              height={100}
            />
          </Col>
        ))
      ) : (
        <Col span={24}>
          <Empty />
        </Col>
      )}
    </Row>
  );
};

export const Docs = () => {
  const dispatch = useDispatch();
  const { attachments, currentConversation } = useSelector(
    (state) => state.chat.chat
  );

  useEffect(() => {
    dispatch(
      getAttachments({
        conversation_id: currentConversation.id,
        type: MessageTypes.DOCUMENT
      })
    );
  }, [currentConversation, dispatch]);

  return (
    <Flex vertical className="overflow-y-auto h-[calc(100vh-160px)] scrollbar">
      {attachments.documents.length > 0 ? (
        attachments.documents.map((document) => (
          <DocItem key={document.id} {...document} />
        ))
      ) : (
        <Empty />
      )}
    </Flex>
  );
};

export const DocItem = ({ file_name, file_size, file_url, file_type }) => {
  return (
    <Flex
      align="center"
      justify="space-between"
      className="p-2 w-full hover:bg-blue-50 rounded cursor-pointer"
    >
      <Flex align="center" gap={4}>
        <img src={getIconDocument(file_type)} className="w-[40px] h-[40px]" />
        <div>
          <p className="font-semibold text-sm line-clamp-1 mb-1">{file_name}</p>
          <p className="text-xs text-gray-500">{formatFileSize(file_size)}</p>
        </div>
      </Flex>
      <Button
        type="text"
        shape="circle"
        href={file_url}
        target="_blank"
        icon={<GoDownload size={20} />}
      />
    </Flex>
  );
};
