import {
  Avatar,
  Button,
  Col,
  Divider,
  Flex,
  Grid,
  Image,
  Row,
  Space,
  Typography
} from 'antd';
import Title from 'antd/es/typography/Title';
import { CloseOutlined, StarOutlined } from '@ant-design/icons';
import { IoChevronForward } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { showSharedMessage, toggleContactInfo } from '~/store/slices/appSlice';
import { faker } from '@faker-js/faker';
import { GrGroup, GrNotification, GrPin } from 'react-icons/gr';
import { AiOutlineEdit } from 'react-icons/ai';
import { useSelector } from '~/store';
const { useBreakpoint } = Grid;

export const ContactInfo = () => {
  const dispatch = useDispatch();
  const { chat } = useSelector((state) => state.chat);
  const screens = useBreakpoint();

  // handle
  const handleClose = () => dispatch(toggleContactInfo());

  const handleOpenSharedMessages = () => dispatch(showSharedMessage());

  return (
    <Flex
      vertical
      className={`w-[350px] ${
        !screens.xl ? 'absolute bg-white right-0 bottom-0 top-0 border-l' : ''
      }`}
      style={{ boxShadow: '0px 0px 2px rgba(0,0,0,.1)' }}
    >
      <Flex
        justify="space-between"
        align="center"
        className="w-full h-[60px] px-4"
        style={{ boxShadow: '0px 0px 2px rgba(0,0,0,.1)' }}
      >
        <p className="m-0 font-semibold">Contact Information</p>
        <Button
          type="text"
          shape="circle"
          icon={<CloseOutlined />}
          size={20}
          onClick={handleClose}
        />
      </Flex>
      <Space className="p-4 w-full" direction="vertical">
        <Space className="w-full" direction="vertical" align="center">
          <Avatar size={64} src={chat.currentConversation.image} />
          <Space align="center" className="mb-4">
            <Title level={5} className="!m-0">
              {chat.currentConversation.title}
            </Title>
            <Button
              type="text"
              size="small"
              shape="circle"
              icon={<AiOutlineEdit />}
              className="bg-neutral-100"
            />
          </Space>
          <HeaderInfoTool />
        </Space>
        <Divider className="my-2" />
        <Typography className="font-bold m-0">About</Typography>
        <Typography>{faker.lorem.sentence()}</Typography>

        <Divider className="my-2" />
        <Flex justify="space-between" align="center">
          <Typography className="font-bold m-0">
            Media, Links and Docs
          </Typography>
          <Button
            type="text"
            shape="circle"
            icon={<IoChevronForward size={20} />}
            onClick={handleOpenSharedMessages}
          />
        </Flex>

        <Row gutter={10}>
          <Col span={8}>
            <Image className="w-full" src={faker.image.urlLoremFlickr()} />
          </Col>
          <Col span={8}>
            <Image className="w-full" src={faker.image.urlLoremFlickr()} />
          </Col>
          <Col span={8}>
            <Image className="w-full" src={faker.image.urlLoremFlickr()} />
          </Col>
        </Row>
        <Divider className="my-3" />
        <Flex justify="space-between">
          <Space>
            <StarOutlined />
            <Typography className="font-bold m-0">Starred Messages</Typography>
          </Space>
          <Button
            type="text"
            shape="circle"
            icon={<IoChevronForward size={20} />}
          />
        </Flex>
        <Divider className="my-3" />
        <Typography className="font-bold m-0">Privacy settings</Typography>
        <Typography>Delete chat history</Typography>
      </Space>
    </Flex>
  );
};

const HeaderInfoTool = () => {
  return (
    <Flex>
      <ToolButton icon={<GrNotification />} text="Mute" />
      <ToolButton icon={<GrPin />} text="Pin" />
      <ToolButton icon={<GrGroup />} text="Create group" />
    </Flex>
  );
};

const ToolButton = ({ text, icon }) => {
  return (
    <Space
      direction="vertical"
      align="center"
      className="w-[74px] h-[78px] text-center"
    >
      <Button
        type="text"
        size="middle"
        shape="circle"
        icon={icon}
        className="bg-neutral-100"
      />
      <span className="text-xs text-gray-500">{text}</span>
    </Space>
  );
};
