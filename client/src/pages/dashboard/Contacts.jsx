import { Col, Flex, Input, Row, Select, Typography } from "antd";
import {
  IoPeopleOutline,
  IoPersonAddOutline,
  IoPersonOutline,
  IoSearchOutline,
} from "react-icons/io5";
import { FriendItem } from "~/section/friends/FriendItem";

const Contacts = () => {
  return (
    <Row className="h-screen">
      <Col span={5} style={{ boxShadow: "0px 0px 2px rgba(0,0,0,.2)" }}>
        <TabItem
          text="Friend Lists"
          icon={<IoPersonOutline size={22} />}
          active
        />
        <TabItem text="Joined Groups" icon={<IoPeopleOutline size={24} />} />
        <TabItem
          text="Friend Requests"
          icon={<IoPersonAddOutline size={22} />}
        />
      </Col>
      <Col span={19}>
        <Flex
          align="center"
          className="h-[60px] p-4"
          style={{ boxShadow: "0px 0px 2px rgba(0,0,0,.2)" }}
        >
          <p className="font-semibold">Friends (20)</p>
        </Flex>
        <Flex className="p-4" gap={10}>
          <Input
            placeholder="Search friends"
            prefix={<IoSearchOutline />}
            className="w-[350px]"
          />
          <Select
            className="w-[250px]"
            defaultValue="asc"
            options={[
              { value: "asc", label: "Name (A-Z)" },
              { value: "desc", label: "Name (Z-A)" },
            ]}
          />
        </Flex>
        <FriendItem />
      </Col>
    </Row>
  );
};

const TabItem = ({ text, icon, active }) => {
  return (
    <Flex
      className={`${
        active ? "bg-blue-50 " : ""
      } p-4 cursor-pointer hover:bg-gray-100`}
      gap={20}
      align="center"
    >
      {icon}
      <Typography className="font-bold">{text}</Typography>
    </Flex>
  );
};

export default Contacts;
