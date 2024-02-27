import {
  Button,
  Checkbox,
  Form,
  Input,
  Typography,
} from 'antd';


const { Paragraph, Text, Link } = Typography;

const Login = () => {
  const onFinish = (values) => {
    // eslint-disable-next-line no-console
    console.log('Received values of form: ', values);
  };
  return (
    <>
      <Text className="flex items-center mb-2 text-2xl font-semibold text-gray-900 dark:text-whit">
        Sign in
      </Text>
      <Paragraph className="text-center">
        Welcome back to Chat apps! Please enter your details below to sign in.
      </Paragraph>
      <Form
        name="form_login"
        layout="vertical"
        className="login-form w-full mb-0"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          label="Gmail"
          name="gmail"
          rules={[{ required: true, message: 'Please input your gmail!' }]}
        >
          <Input placeholder="Email" variant="filled" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your password!'
            }
          ]}
        >
          <Input.Password
            type="password"
            placeholder="Password"
            variant="filled"
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
          <Button type="primary" htmlType="submit" className="w-full">
            Log in
          </Button>
        </Form.Item>
        <Form.Item className="text-center my-0">
          <Text>{"Don't have an account?"}</Text>
          <Link href="/auth/register"> Sign up now</Link>
        </Form.Item>
      </Form>
    </>
  );
};

export default Login;
