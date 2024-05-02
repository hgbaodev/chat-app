import { Flex } from 'antd';
import { formatTimeAgo } from '~/utils/formatTimeAgo';

export const NotificationItem = ({ title, message, seen, created_at }) => {
  return (
    <Flex
      vertical
      className={`${
        !seen ? 'bg-blue-100' : ''
      } p-3 rounded-md cursor-pointer border-x-0 border-t-0 border-b border-solid border-[#e5e5e5]`}
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
