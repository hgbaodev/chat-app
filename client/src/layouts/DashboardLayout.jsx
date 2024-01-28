import { Avatar, Button, Col, Flex, Row, Space, Switch } from 'antd';
import { Outlet } from 'react-router-dom';
import logo_light from '~/assets/icon_app.svg';
import logo_dark from '~/assets/icon_app_dark.svg';
import { WechatOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { useState } from 'react';
const DashboardLayout = () => {
  // handle
  const [mode, setMode] = useState(false);
  const handleToggleMode = () => {
    const isDarkMode = document.body.classList.contains('dark');
    setMode(isDarkMode);
    if (isDarkMode) {
      document.body.classList.remove('dark');
    } else {
      document.body.classList.add('dark');
    }
  };

  // render
  return (
    <Row className="h-[100vh]">
      <Col span={1} className="bg-gray-50 flex items-center flex-col py-2 dark:bg-gray-900">
        <Flex vertical justify="space-between" align="center" className="h-[100%]">
          <Flex vertical align="center" className="text-white">
            <img src={mode ? logo_light : logo_dark} alt="logo" className="dark:text-white" />
            <Space direction="vertical" size={20} className="mt-1">
              <Button type="primary" icon={<WechatOutlined />} size="large" className="dark:text-white" />
              <Button type="text" icon={<UserOutlined />} size="large" className="dark:text-white" />
              <Button type="text" icon={<SettingOutlined />} size="large" className="dark:text-white" />
            </Space>
          </Flex>
          <Space direction="vertical" size={18} align="center">
            <Switch
              checkedChildren="light"
              unCheckedChildren="dark"
              defaultChecked={!document.body.classList.contains('dark')}
              onChange={handleToggleMode}
              size="small"
            />
            <Avatar style={{ backgroundColor: '#fde3cf', color: '#f56a00' }}>P</Avatar>
          </Space>
        </Flex>
      </Col>
      <Col span={23} className="h-[100%]">
        <Outlet />
      </Col>
    </Row>
  );
};

export default DashboardLayout;
