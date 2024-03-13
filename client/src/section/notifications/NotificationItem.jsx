import { Flex } from 'antd';
import { formatTimeAgo } from '~/utils/formatTimeAgo';

export const NotificationItem = ({ message, seen, created_at }) => {
  return (
    <Flex
      vertical
      className={`p-4 rounded-md ${seen ? 'bg-blue-50' : 'bg-blue-200'}`}
      gap={6}
    >
      <p>{message}</p>
      <p className="text-[12px]">{formatTimeAgo(created_at)}</p>
    </Flex>
  );
};
