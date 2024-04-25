import { Flex, Row, Typography, Col, Divider, Space } from 'antd';
import FormLogin from '~/section/auth/FormLogin';
import GoogleComponent from '~/components/GoogleComponent';
import GithubComponent from '~/components/GithubComponent';

const { Text } = Typography;

const Login = () => {
  return (
    <Row justify="center" className="h-[100vh] bg-neutral-100">
      <Col
        xs={20}
        md={16}
        lg={12}
        xl={8}
        className="flex flex-col justify-center items-center"
      >
        <Flex
          gap="small"
          vertical
          justify="center"
          align="center"
          className="w-full mx-auto bg-white rounded-lg py-6 px-8"
        >
          <Space direction="vertical">
            <GoogleComponent />
            <GithubComponent />
          </Space>
          <Divider>Or</Divider>
          <Text className="text-2xl font-medium mb-5">
            Sign in to your account
          </Text>
          <FormLogin />
        </Flex>
      </Col>
    </Row>
  );
};

export default Login;
