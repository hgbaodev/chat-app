import { Flex, Skeleton, Space } from 'antd';

const ContactItemSkeleton = () => {
  return (
    <Flex
      className={`bg-white px-4 py-3 cursor-pointer`}
      align="center"
      justify="space-between"
    >
      <Space className="flex-1">
        <Skeleton.Avatar size={42} shape="circle" active />
        <Flex vertical justify="center">
          <Skeleton
            title={{
              width: 120
            }}
            paragraph={{
              rows: 1,
              width: 230
            }}
            active
          />
        </Flex>
      </Space>
    </Flex>
  );
};

export default ContactItemSkeleton;
