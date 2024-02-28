import { Avatar, Flex, Space, Switch } from 'antd';
import { NavLink, Outlet } from 'react-router-dom';
import logo_dark from '~/assets/icon_app.svg';
import {
  IoChatbubbleEllipsesOutline,
  IoPeopleOutline,
  IoSettingsOutline
} from 'react-icons/io5';
const DashboardLayout = () => {
  // render
  return (
    <Flex className="h-[100vh]">
      <Flex
        vertical
        justify="space-between"
        align="center"
        className="bg-white dark:bg-gray-900 py-2 h-[100%] w-[64px]"
      >
        <Flex vertical align="center">
          <img src={logo_dark} alt="logo" className="cursor-pointer" />
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
        <Space direction="vertical" size={18} align="center" className="mb-4">
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
        (isActive ? 'bg-neutral-300' : 'hover:bg-neutral-200') +
        ' text-black flex items-center justify-center h-[64px] w-[64px] hover:text-black'
      }
    >
      <span className="">{icon}</span>
    </NavLink>
  );
};

export default DashboardLayout;
