import { Flex, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
export const Loading = () => {
  return (
    <Flex
      align="center"
      justify="center"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
      }}
    >
      <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />} />
    </Flex>
  );
};
