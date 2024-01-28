import { Col, Flex, Row } from 'antd';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  return (
    <Row className="h-[100vh]">
      <Col span={1} className="bg-[red]">
        Navbar
      </Col>
      <Col span={23} className="bg-[green]">
        <Outlet />
      </Col>
    </Row>
  );
};

export default DashboardLayout;
