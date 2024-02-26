import {
  Avatar,
  Button,
  Col,
  Divider,
  Flex,
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

export const ContactInfo = () => {
  const dispatch = useDispatch();

  // handle
  const handleClose = () => {
    dispatch(toggleContactInfo());
  };
  const handleOpenSharedMessages = () => {
    dispatch(showSharedMessage());
  };
  return (
    <Flex
      vertical
      className="w-[350px]"
      style={{ boxShadow: '0px 0px 2px rgba(0,0,0,.2)' }}
    >
      <Flex
        justify="space-between"
        align="center"
        className="w-full h-[60px] px-4"
        style={{ boxShadow: '0px 0px 2px rgba(0,0,0,.2)' }}
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
          <Avatar
            size={64}
            style={{ backgroundColor: '#fde3cf', color: '#f56a00' }}
          >
            {faker.person.fullName()[0].toUpperCase()}
          </Avatar>
          <Title level={5} className="m-0">
            {faker.person.fullName()}
          </Title>
        </Space>
        <Divider className="my-2" />
        <Typography className="font-bold m-0">About</Typography>
        <Typography>{faker.lorem.sentence()}</Typography>

        <Divider className="my-2" />
        <Flex justify="space-between">
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
        <Typography>{faker.lorem.sentence()}</Typography>
      </Space>
    </Flex>
  );
};
