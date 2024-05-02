import { Button, Drawer, Empty, Space, Tooltip } from 'antd';
import { useEffect } from 'react';
import { IoCheckmarkDone } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import CustomLoader from '~/components/CustomLoader';
import { NotificationItem } from '~/section/notifications/NotificationItem';
import {
  getAllNotifications,
  markAllNotificationsAsSeen
} from '~/store/slices/notificationSlice';

const Notification = ({ open, handleClose }) => {
  const dispatch = useDispatch();
  const { notifications, isLoading } = useSelector(
    (state) => state.notifications
  );
  useEffect(() => {
    if (open) {
      dispatch(getAllNotifications());
    }
  }, [dispatch, open]);

  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsSeen());
  };

  return (
    <Drawer
      title="Notifications"
      placement={'right'}
      closable={false}
      onClose={handleClose}
      open={open}
      key={'left'}
      extra={
        <Tooltip placement="bottomRight" title="Mark all as read">
          <Button
            shape="circle"
            type="primary"
            icon={<IoCheckmarkDone />}
            onClick={handleMarkAllAsRead}
          />
        </Tooltip>
      }
    >
      <Space direction="vertical" className="w-full">
        {isLoading ? (
          <CustomLoader />
        ) : notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              title={notification.title}
              message={notification.message}
              created_at={notification.created_at}
              seen={notification.seen}
            />
          ))
        ) : (
          <Empty description="No notifications" />
        )}
      </Space>
    </Drawer>
  );
};

export default Notification;
