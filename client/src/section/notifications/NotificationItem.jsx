import { Flex } from 'antd';
import { formatTimeAgo } from '~/utils/formatTimeAgo';

export const NotificationItem = ({ title, message, seen, created_at }) => {
  return (
    <Flex
      vertical
      className={`p-3 rounded-md cursor-pointer ${
        seen ? 'bg-gray-100' : 'bg-blue-100'
      }`}
      gap={6}
    >
      <p className="text-[14px] font-semibold">{title}</p>
      <p className="text-[14px] overflow-hidden line-clamp-2 text-ellipsis">
        {message}
      </p>
      <p className="text-[12px]">{formatTimeAgo(created_at)}</p>
    </Flex>
  );
};
