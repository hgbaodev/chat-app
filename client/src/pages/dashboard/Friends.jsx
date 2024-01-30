import { Avatar, Button, Col, Flex, Row, Space, Typography } from 'antd';
import Title from 'antd/es/typography/Title';
import { Sidebar } from '~/section/friends/Sidebar';

import { faker } from '@faker-js/faker';
import { FriendItem } from '~/section/friends/FriendItem';

const Friends = () => {
  return (
    <Row className="h-full ">
      <Col span={5} className="p-4 bg-blue-50" style={{ boxShadow: '0px 0px 2px rgba(0,0,0,.2)' }}>
        <Sidebar />
      </Col>
      <Col span={19}>
        <Flex vertical className="w-full h-full">
          <Flex
            className="h-[60px] px-4 w-full"
            justify="start"
            align="center"
            style={{ boxShadow: '0px 0px 2px rgba(0,0,0,.2)' }}
          >
            <Title level={5} className="m-0">
              Friends (20)
            </Title>
          </Flex>
          <Space direction='vertical' className="p-4">
            <FriendItem />
            <FriendItem />
            <FriendItem />
            <FriendItem />
          </Space>
        </Flex>
      </Col>
    </Row>
  );
};

export default Friends;
