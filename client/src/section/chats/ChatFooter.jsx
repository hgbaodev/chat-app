import { Button, Flex } from 'antd';
import { PaperClipOutlined } from '@ant-design/icons';
import Search from 'antd/es/input/Search';
export const ChatFooter = () => {
  return (
    <Flex className="h-[60px] p-3" align="center">
      <Button type="text" shape="circle" icon={<PaperClipOutlined />} size="large" />
      <Search placeholder="Message..." allowClear enterButton="Send" size="large" onSearch={null} />
    </Flex>
  );
};
