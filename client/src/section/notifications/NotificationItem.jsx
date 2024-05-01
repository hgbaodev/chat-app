import { Flex } from 'antd';
import { formatTimeAgo } from '~/utils/formatTimeAgo';

export const NotificationItem = ({ title, message, created_at }) => {
  return (
    <Flex
      vertical
      className={`p-3 rounded-md cursor-pointer`}
      style={{ borderBottom: '1px solid #e5e5e5' }}
      gap={0}
    >
      <p className="text-[14px] font-semibold">{title}</p>
      <p className="my-1 text-[14px] overflow-hidden line-clamp-2 text-ellipsis">
        {message}
      </p>
      <p className="text-[12px]">{formatTimeAgo(created_at)}</p>
    </Flex>
  );
};
