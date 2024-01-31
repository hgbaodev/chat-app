import { Empty, Flex, Space, Typography } from "antd";
import { IoPersonAddOutline } from "react-icons/io5";

const TabFriendsRequest = () => {
  return (
    <Space
      direction="vertical"
      size="large"
      className="w-[100%] h-screen bg-neutral-100"
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
      <Space direction="vertical" className="w-[100%] px-5">
        <Typography className="font-semibold">Requests Received (3)</Typography>
        <Empty
          description="Your incoming request list is empty"
          className="py-4"
        />
      </Space>
      <Space direction="vertical" className="w-[100%] px-5">
        <Typography className="font-semibold">Requests Received (3)</Typography>
        <Empty
          description="Your incoming request list is empty"
          className="py-4"
        />
      </Space>
    </Space>
  );
};

export default TabFriendsRequest;
