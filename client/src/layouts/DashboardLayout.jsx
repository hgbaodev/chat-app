import { Avatar, Button, Col, Flex, Row, Space, Switch } from 'antd';
import { Outlet } from 'react-router-dom';
import logo from '~/assets/react.svg';
import { WechatOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
const DashboardLayout = () => {
  return (
    <Row className="h-[100vh] ">
      <Col span={1} className="bg-gray-50 flex items-center flex-col py-4 dark:bg-gray-900 ">
        <Flex vertical justify="space-between" align="center" className="h-[100%]">
          <Flex vertical align="center" className="text-white">
            <img src={logo} alt="logo" />
            <Space direction="vertical" size={20} className="mt-9">
              <Button type="primary" icon={<WechatOutlined />} size="large" className="dark:text-white" />
              <Button type="text" icon={<UserOutlined />} size="large" className="dark:text-white" />
              <Button type="text" icon={<SettingOutlined />} size="large" className="dark:text-white" />
            </Space>
          </Flex>
          <Space direction="vertical" size={18} align="center">
            <Switch checkedChildren="light" unCheckedChildren="dark" defaultChecked onChange={() => {}} size="small" />
            <Avatar style={{ backgroundColor: '#fde3cf', color: '#f56a00' }}>P</Avatar>
          </Space>
        </Flex>
      </Col>
      <Col span={23}>
        <Outlet />
      </Col>
    </Row>
  );
};

export default DashboardLayout;
