import { Drawer, Empty, Space } from 'antd';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomLoader from '~/components/CustomLoader';
import { NotificationItem } from '~/section/notifications/NotificationItem';
import { getAllNotifications } from '~/store/slices/notificationSlice';

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

  return (
    <Drawer
      title="Notifications"
      placement={'right'}
      closable={false}
      onClose={handleClose}
      open={open}
      key={'left'}
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
