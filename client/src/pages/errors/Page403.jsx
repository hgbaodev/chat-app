import { Button, Flex, Result } from 'antd';

const Page404 = () => {
  return (
    <Flex align="center" justify="center" className="h-screen">
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={<Button type="primary">Back Home</Button>}
      />
    </Flex>
  );
};
export default Page404;
