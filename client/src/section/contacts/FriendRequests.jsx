import { Col, Flex, Row } from 'antd';
import { FriendRequestItem } from './FriendRequestItem';

const FriendRequests = () => {
  return (
    <>
      <Flex align="center" className="h-[53px] p-4" style={{ boxShadow: '0px 1px 1px rgba(0,0,0,.1)' }}>
        <p className="font-semibold">Friend Requests (20)</p>
      </Flex>
      <Flex vertical className="p-4 " gap={10}>
        <p className="font-semibold">Lời mời đã nhận (5)</p>
        <Flex justify="start" gap={14}>
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <FriendRequestItem />
            </Col>
            <Col span={6}>
              <FriendRequestItem />
            </Col>
            <Col span={6}>
              <FriendRequestItem />
            </Col>
            <Col span={6}>
              <FriendRequestItem />
            </Col>
            <Col span={6}>
              <FriendRequestItem />
            </Col>
            <Col span={6}>
              <FriendRequestItem />
            </Col>
            <Col span={6}>
              <FriendRequestItem />
            </Col>
            <Col span={6}>
              <FriendRequestItem />
            </Col>
          </Row>
        </Flex>
        <p className="font-semibold">Lời mời đã gửi (5)</p>
      </Flex>
    </>
  );
};

export default FriendRequests;
