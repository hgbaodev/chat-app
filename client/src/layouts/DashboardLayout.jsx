import { Avatar, Badge, Flex, Space, Tooltip } from 'antd';
import { NavLink, Outlet } from 'react-router-dom';
import {
  IoChatbubbleEllipses,
  IoLogOut,
  IoNotifications,
  IoPeopleSharp,
  IoSettings
} from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { useDispatch } from '~/store';
import { logout } from '~/store/slices/authSlice';
import { useEffect, useState } from 'react';
import { getNumberOfReceiveFriendRequests } from '~/store/slices/relationshipSlice';
import { getNumberOfUnseenNotifications } from '~/store/slices/notificationSlice';
import Notification from '~/pages/dashboard/Notification';
import { setOpenMyProfile, setOpenSearch } from '~/store/slices/contactSlice';
import AccountModal from '~/section/common/AccountModal';
import ProfileModal from '~/section/common/ProfileModal';
import CallModal from '~/section/call/CallModal';

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const { avatar } = useSelector((state) => state.auth.user);
  const { received_friend_requests } = useSelector(
    (state) => state.relationship
  );
  const { totalUnseen } = useSelector((state) => state.notifications);
  const [openNotification, setOpenNotification] = useState(false);

  // effect
  useEffect(() => {
    dispatch(getNumberOfReceiveFriendRequests());
    dispatch(getNumberOfUnseenNotifications());
  }, [dispatch]);

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
              <Avatar
                size={40}
                src={avatar}
                className="cursor-pointer"
                onClick={() => {
                  dispatch(setOpenMyProfile(true));
                }}
              />
              <NavButton
                href="/"
                tooltip="Messages"
                icon={
                  <IoChatbubbleEllipses size={27} className="text-gray-500" />
                }
                badge={0}
                onClick={() => {
                  dispatch(setOpenSearch(false));
                }}
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
          <Space direction="vertical" align="center">
            <NavButton
              href="/settings"
              tooltip="Settings"
              icon={<IoSettings size={27} className="text-gray-500" />}
              badge={0}
            />
            <NavButton
              href="#"
              tooltip="Logout"
              icon={<IoLogOut size={27} className="text-gray-500" />}
              badge={0}
              onClick={() => dispatch(logout())}
            />
          </Space>
        </Flex>
        <div className="h-screen flex-1">
          <Outlet />
        </div>
      </Flex>
      <Notification
        open={openNotification}
        handleClose={() => {
          setOpenNotification(false);
        }}
      />
      <AccountModal />
      <CallModal />
      <ProfileModal />
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
