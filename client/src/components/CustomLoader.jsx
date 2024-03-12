import { Flex, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
const CustomLoader = () => (
  <Flex vertical align="center" justify="center" className="w-full h-full">
    <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />} />
  </Flex>
);

export default CustomLoader;
