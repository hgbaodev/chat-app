import { Avatar, Col, Flex, List, Row, Typography } from "antd";
import {
  IoPeopleOutline,
  IoPersonAddOutline,
  IoPersonOutline,
} from "react-icons/io5";

const data = [
  {
    title: "Ant Design Title 1",
  },
  {
    title: "Ant Design Title 2",
  },
  {
    title: "Ant Design Title 3",
  },
  {
    title: "Ant Design Title 4",
  },
];

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
      <Col span={19} className="p-5">
        <List
          className="w-[100%]"
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar
                    size="large"
                    src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                  />
                }
                title={<a href="https://ant.design">{item.title}</a>}
                description="Ant Design, a design language for background applications, is refined by Ant UED Team"
              />
            </List.Item>
          )}
        />
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
