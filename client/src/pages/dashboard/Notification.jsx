import { Flex, Space } from 'antd';
import { NotificationItem } from '~/section/notifications/NotificationItem';

const Notification = () => {
  return (
    <Flex className="h-full">
      <Flex
        vertical
        className="w-[350px] p-4"
        style={{ boxShadow: '0px 0px 2px rgba(0,0,0,.2)' }}
      >
        <h1 className="text-[16px] mb-4">Notifications</h1>
        <Space direction="vertical" className="w-full">
          <NotificationItem message="123" created_at={null} seen={false} />
          <NotificationItem message="123" created_at={null} seen={false} />
          <NotificationItem message="123" created_at={null} seen={true} />
          <NotificationItem message="123" created_at={null} seen={true} />
        </Space>
      </Flex>
      <Flex></Flex>
    </Flex>
  );
};

export default Notification;
