import { Flex, Space } from 'antd';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomLoader from '~/components/CustomLoader';
import { NotificationItem } from '~/section/notifications/NotificationItem';
import { getAllNotifications } from '~/store/slices/notificationSlice';

const Notification = () => {
  const dispatch = useDispatch();
  const { notifications, isLoading } = useSelector(
    (state) => state.notifications
  );
  useEffect(() => {
    dispatch(getAllNotifications());
  }, [dispatch]);

  return (
    <Flex className="h-full">
      <Flex
        vertical
        className="w-[350px] p-4 cursor-pointer"
        style={{ boxShadow: '0px 0px 2px rgba(0,0,0,.2)' }}
      >
        <h1 className="text-[16px] mb-4">Notifications</h1>
        <Space direction="vertical" className="w-full">
          {isLoading ? (
            <CustomLoader />
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                title={notification.title}
                message={notification.message}
                created_at={notification.created_at}
                seen={notification.seen}
              />
            ))
          )}
        </Space>
      </Flex>
      <Flex></Flex>
    </Flex>
  );
};

export default Notification;
