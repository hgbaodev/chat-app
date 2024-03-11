import { Flex, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
const Loader = () => (
  <Flex
    align="center"
    justify="center"
    className="fixed top-0 left-0 right-0 bottom-0 z-[999]"
  >
    <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />} />
  </Flex>
);

export default Loader;
