import {
  Avatar,
  Badge,
  Dropdown,
  Flex,
  Space,
  Tooltip,
  Typography
} from 'antd';
import { NavLink, Outlet } from 'react-router-dom';
import logo_dark from '~/assets/icon_app.svg';
import {
  IoChatbubbleEllipsesOutline,
  IoNotificationsOutline,
  IoPeopleOutline,
  IoSettingsOutline
} from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { useDispatch } from '~/store';
import { logout } from '~/store/slices/authSlice';
import { useEffect, useState } from 'react';
import ProfileModal from '~/section/common/ProfileModal';
import { getNumberOfReceiveFriendRequests } from '~/store/slices/relationshipSlice';
import { getNumberOfUnseenNotifications } from '~/store/slices/notificationSlice';

const { Text } = Typography;

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const { avatar, fullName } = useSelector((state) => state.auth.user);
  const { received_friend_requests } = useSelector(
    (state) => state.relationship
  );
  const { totalUnseen } = useSelector((state) => state.notifications);
  const [openProfile, setOpenProfile] = useState(false);

  // effect
  useEffect(() => {
    dispatch(getNumberOfReceiveFriendRequests());
    dispatch(getNumberOfUnseenNotifications());
  }, [dispatch]);

  const items = [
    {
      key: '0',
      label: <Text>{fullName}</Text>,
      disabled: true
    },
    {
      key: '2',
      label: 'Profile'
    },
    {
      key: '3',
      label: 'Setting'
    },
    {
      key: '4',
      label: 'Logout'
    }
  ];

  const onClick = ({ key }) => {
    if (key == 4) {
      dispatch(logout());
    }
    if (key == 2) {
      setOpenProfile(true);
    }
  };

  return (
    <>
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
                badge={0}
              />
              <NavButton
                href="/contacts"
                tooltip="Contacts"
                icon={<IoPeopleOutline size={27} />}
                badge={received_friend_requests.length}
              />
              <NavButton
                href="/notifications"
                tooltip="Notifications"
                icon={<IoNotificationsOutline size={27} />}
                badge={totalUnseen}
              />
              <NavButton
                href="/settings"
                tooltip="Settings"
                icon={<IoSettingsOutline size={27} />}
                badge={0}
              />
            </Flex>
          </Flex>
          <Space direction="vertical" size={18} align="center" className="mb-4">
            <Dropdown
              menu={{
                items,
                onClick
              }}
              placement="topRight"
              trigger={['click']}
              arrow="true"
            >
              <a onClick={(e) => e.preventDefault()}>
                <Avatar size={40} src={avatar} />
              </a>
            </Dropdown>
          </Space>
        </Flex>
        <div className="h-screen flex-1">
          <Outlet />
        </div>
      </Flex>
      <ProfileModal open={openProfile} setOpen={setOpenProfile} />
    </>
  );
};
/* <Tooltip placement="right" title={tooltip}>
    </Tooltip> */
const NavButton = ({ tooltip, href, icon, badge }) => {
  return (
    <Tooltip placement="rightTop" title={tooltip}>
      <NavLink
        to={href}
        className={({ isActive }) =>
          (isActive ? 'bg-neutral-300' : 'hover:bg-neutral-200') +
          ' text-black flex items-center justify-center h-[64px] w-[64px] hover:text-black'
        }
      >
        <Badge count={badge} overflowCount={5} offset={[0, 5]}>
          <span className="">{icon}</span>
        </Badge>
      </NavLink>
    </Tooltip>
  );
};

export default DashboardLayout;
