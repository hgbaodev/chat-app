import logo_light from '~/assets/icon_app.svg';
import {
  Button,
  Checkbox,
  Form,
  Input,
  Flex,
  Row,
  Typography,
  Col,
  Divider
} from 'antd';

import { LockOutlined, UserOutlined } from '@ant-design/icons';
import GoogleLoginCustom from '~/components/GoogleLoginCustom';

const { Text, Link } = Typography;

const Login = () => {
  return (
    <Row justify="center" className="h-[100vh] bg-neutral-100">
      <Col
        xs={24}
        md={12}
        lg={8}
        className="flex flex-col justify-center items-center"
      >
        <Flex
          gap="small"
          vertical
          justify="center"
          align="center"
          className="w-full mx-auto bg-white rounded-lg py-3 px-8"
        >
          <Link href="/" className="cursor-pointer">
            <img src={logo_light} className="object-fill w-[100px] h-[100px]" />
          </Link>
          <GoogleLoginCustom />
          <Divider>OR</Divider>
          <Text className="text-2xl font-medium mb-5">
            Sign in to your account
          </Text>

          <FormLogin />
        </Flex>
      </Col>
    </Row>
  );
};

const FormLogin = () => {
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };
  return (
    <Form
      name="normal_login"
      className="login-form w-full"
      initialValues={{ remember: true }}
      onFinish={onFinish}
    >
      <Form.Item
        name="email"
        rules={[
          { required: true, message: 'Please input your username!' },
          { type: 'email', message: 'Email is not valid' }
        ]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder="Email address"
          variant="filled"
          size="large"
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your password!'
          }
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          type="password"
          placeholder="Password"
          variant="filled"
          size="large"
        />
      </Form.Item>
      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Link className="float-right" href="/auth/forgot-password">
          Forgot password
        </Link>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="w-full" size='large'>
          Login
        </Button>
      </Form.Item>
      <Form.Item className="text-center">
        <Text>{"Don't have an account?"}</Text>
        <Link href="/auth/register"> Sign up now</Link>
      </Form.Item>
    </Form>
  );
};

export default Login;
