import { Button, Flex, Result } from 'antd';
import { Link } from 'react-router-dom';

const Page404 = () => {
  return (
    <Flex align="center" justify="center" className="h-screen">
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Link to="/">
            <Button type="primary">Back Home</Button>
          </Link>
        }
      />
    </Flex>
  );
};
export default Page404;
