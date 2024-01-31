import { Avatar, Flex, Space, Switch } from 'antd';
import { NavLink, Outlet } from 'react-router-dom';
import logo_dark from '~/assets/icon_app_dark.svg';
import {
  IoChatbubbleEllipsesOutline,
  IoPeopleOutline,
  IoSettingsOutline
} from 'react-icons/io5';
import { useState } from 'react';
const DashboardLayout = () => {
  // handle
  const [mode, setMode] = useState(true);
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
    <Flex className="h-[100vh]">
      <Flex
        vertical
        justify="space-between"
        align="center"
        className="bg-blue-500 dark:bg-gray-900 py-2 h-[100%] w-[64px]"
      >
        <Flex vertical align="center" className="text-white">
          <img src={logo_dark} alt="logo" className="dark:text-white" />
          <Flex vertical className="mt-5 w-[100%]">
            <NavButton
              href="/"
              tooltip="Messages"
              icon={<IoChatbubbleEllipsesOutline size={27} />}
            />
            <NavButton
              href="/contacts"
              tooltip="Contacts"
              icon={<IoPeopleOutline size={27} />}
            />
            <NavButton
              href="/settings"
              tooltip="Settings"
              icon={<IoSettingsOutline size={27} />}
            />
          </Flex>
        </Flex>
        <Space direction="vertical" size={18} align="center">
          <Switch
            checkedChildren="light"
            unCheckedChildren="dark"
            defaultChecked={!document.body.classList.contains('dark')}
            onChange={handleToggleMode}
            size="small"
          />
          <Avatar style={{ backgroundColor: '#fde3cf', color: '#f56a00' }}>
            P
          </Avatar>
        </Space>
      </Flex>
      <div className="h-screen flex-1">
        <Outlet />
      </div>
    </Flex>
  );
};
/* <Tooltip placement="right" title={tooltip}>
    </Tooltip> */
const NavButton = ({ tooltip, href, icon }) => {
  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        (isActive ? 'bg-blue-700' : 'hover:bg-blue-600 ') +
        ' text-white flex items-center justify-center h-[64px] w-[64px] hover:text-inherit'
      }
    >
      <span className="">{icon}</span>
    </NavLink>
  );
};

export default DashboardLayout;
