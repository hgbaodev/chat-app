import { Button, Col, Flex, Row, Typography } from 'antd';
import { IoPeopleOutline, IoPersonAddOutline, IoPersonOutline } from 'react-icons/io5';
import { NavLink, Outlet } from 'react-router-dom';

const Contacts = () => {
  return (
    <Row className="h-screen">
      <Col span={5} style={{ boxShadow: '0px 0px 2px rgba(0,0,0,.2)' }}>
        <NavButton href="friends" text="Friend Lists" icon={<IoPersonOutline size={22} />} />
        <NavButton href="groups" text="Joined Groups" icon={<IoPeopleOutline size={24} />} />
        <NavButton href="friend-requests" text="Friend Requests" icon={<IoPersonAddOutline size={22} />} />
      </Col>
      <Col span={19}>
        <Outlet />
      </Col>
    </Row>
  );
};

const NavButton = ({ href, icon, text }) => {
  return (
    <NavLink to={href}>
      {({ isActive }) => (
        <Flex
          className={`${isActive ? 'bg-blue-50 ' : ''} p-4 cursor-pointer hover:bg-gray-100 text-black`}
          gap={20}
          align="center"
        >
          {icon}
          <Typography className="font-bold">{text}</Typography>
        </Flex>
      )}
    </NavLink>
  );
};

export default Contacts;
