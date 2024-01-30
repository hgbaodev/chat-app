import { Avatar, Button, Col, Flex, Row, Space, Switch } from "antd";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import logo_light from "~/assets/icon_app.svg";
import logo_dark from "~/assets/icon_app_dark.svg";
import {
  IoChatbubbleEllipsesOutline,
  IoPeopleOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import { useState } from "react";
const DashboardLayout = () => {
  // handle
  const [mode, setMode] = useState(true);
  const handleToggleMode = () => {
    const isDarkMode = document.body.classList.contains("dark");
    setMode(isDarkMode);
    if (isDarkMode) {
      document.body.classList.remove("dark");
    } else {
      document.body.classList.add("dark");
    }
  };

  // render
  return (
    <Row className="h-[100vh]">
      <Col
        span={1}
        className="bg-gray-50 flex items-center flex-col py-2 dark:bg-gray-900"
      >
        <Flex
          vertical
          justify="space-between"
          align="center"
          className="h-[100%]"
        >
          <Flex vertical align="center" className="text-white">
            <img
              src={mode ? logo_light : logo_dark}
              alt="logo"
              className="dark:text-white"
            />
            <Space direction="vertical" size={20} className="mt-1">
              <NavButton
                href="/"
                icon={<IoChatbubbleEllipsesOutline size={24} />}
              />
              <NavButton href="/friends" icon={<IoPeopleOutline size={24} />} />
              <NavButton
                href="/settings"
                icon={<IoSettingsOutline size={24} />}
              />
            </Space>
          </Flex>
          <Space direction="vertical" size={18} align="center">
            <Switch
              checkedChildren="light"
              unCheckedChildren="dark"
              defaultChecked={!document.body.classList.contains("dark")}
              onChange={handleToggleMode}
              size="small"
            />
            <Avatar style={{ backgroundColor: "#fde3cf", color: "#f56a00" }}>
              P
            </Avatar>
          </Space>
        </Flex>
      </Col>
      <Col span={23} className="h-[100%]">
        <Outlet />
      </Col>
    </Row>
  );
};

const NavButton = ({ href, icon }) => {
  return (
    <NavLink to={href}>
      {({ isActive }) => (
        <Button
          type={isActive ? "primary" : "text"}
          icon={icon}
          size="large"
          className="dark:text-white"
        />
      )}
    </NavLink>
  );
};

export default DashboardLayout;
