import {
  Avatar,
  Badge,
  Dropdown,
  Flex,
  Space,
  Tooltip,
  Typography
} from 'antd';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import logo_dark from '~/assets/icon_app.svg';
import {
  IoChatbubbleEllipses,
  IoChatbubbleEllipsesOutline,
  IoNotifications,
  IoNotificationsOutline,
  IoPeopleOutline,
  IoPeopleSharp,
  IoSettings,
  IoSettingsOutline
} from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { useDispatch } from '~/store';
import { logout } from '~/store/slices/authSlice';
import { useEffect, useState } from 'react';
import ProfileModal from '~/section/common/ProfileModal';
import { getNumberOfReceiveFriendRequests } from '~/store/slices/relationshipSlice';
import { getNumberOfUnseenNotifications } from '~/store/slices/notificationSlice';
import Notification from '~/pages/dashboard/Notification';
import VideoCallModal from '~/section/call/VideoCallModal';

const { Text } = Typography;

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const { avatar, fullName } = useSelector((state) => state.auth.user);
  const { received_friend_requests } = useSelector(
    (state) => state.relationship
  );
  const { totalUnseen } = useSelector((state) => state.notifications);
  const [openProfile, setOpenProfile] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);

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
            <Flex vertical className="w-[100%]" gap="middle">
              <Dropdown
                menu={{
                  items,
                  onClick
                }}
                placement="topRight"
                trigger={['click']}
                arrow="true"
              >
                <Avatar size={40} src={avatar} />
              </Dropdown>
              <NavButton
                href="/"
                tooltip="Messages"
                icon={
                  <IoChatbubbleEllipses size={27} className="text-gray-500" />
                }
                badge={0}
              />
              <NavButton
                href="/contacts"
                tooltip="Contacts"
                icon={<IoPeopleSharp size={27} className="text-gray-500" />}
                badge={received_friend_requests.length}
              />
              <NavButton
                href="#"
                tooltip="Notifications"
                icon={<IoNotifications size={27} className="text-gray-500" />}
                badge={totalUnseen}
                onClick={() => setOpenNotification(true)}
              />
            </Flex>
          </Flex>
          <Space direction="vertical" size={18} align="center" className="mb-4">
            <NavButton
              href="/settings"
              tooltip="Settings"
              icon={<IoSettings size={27} className="text-gray-500" />}
              badge={0}
            />
          </Space>
        </Flex>
        <div className="h-screen flex-1">
          <Outlet />
        </div>
      </Flex>
      {openProfile && (
        <ProfileModal open={openProfile} setOpen={setOpenProfile} />
      )}
      <Notification
        open={openNotification}
        handleClose={() => {
          setOpenNotification(false);
        }}
      />
      <VideoCallModal />
    </>
  );
};

const NavButton = ({ tooltip, href, icon, badge, ...other }) => {
  return (
    <Tooltip placement="rightTop" title={tooltip} {...other}>
      <NavLink
        to={href}
        className={({ isActive }) =>
          (isActive && href !== '#' ? 'bg-gray-200' : 'hover:bg-gray-100') +
          ' text-black flex items-center justify-center h-[45px] w-[45px] hover:text-black rounded-md'
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
