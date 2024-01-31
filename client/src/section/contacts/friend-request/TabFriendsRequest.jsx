import { Col, Empty, Flex, Row, Space, Typography } from "antd";
import { IoPersonAddOutline } from "react-icons/io5";
import FriendRequestItem from "~/section/contacts/friend-request/FriendRequestItem";

const TabFriendsRequest = () => {
  return (
    <Space
      direction="vertical"
      size="large"
      className="w-[100%] bg-neutral-100"
    >
      <Flex
        align="center"
        gap={10}
        className="h-[60px] p-4 bg-white"
        style={{ boxShadow: "0px 0px 2px rgba(0,0,0,.2)" }}
      >
        <IoPersonAddOutline size={22} />
        <p className="font-semibold">Friend Requests</p>
      </Flex>
      <Space
        direction="vertical"
        size="large"
        className="overflow-y-auto h-[calc(100vh-84px)]"
      >
        <Space direction="vertical" className="w-[100%] px-5">
          <Typography className="font-semibold">
            Requests Received (3)
          </Typography>
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
        </Space>
        <Space direction="vertical" className="w-[100%] px-5">
          <Typography className="font-semibold">
            Requests Received (3)
          </Typography>
          <Empty
            description="Your incoming request list is empty"
            className="py-4"
          />
        </Space>
      </Space>
    </Space>
  );
};

export default TabFriendsRequest;
