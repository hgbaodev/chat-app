import logo_light from "~/assets/icon_app.svg";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Flex,
  Row,
  Typography,
  Col,
  Divider,
} from "antd";

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import GoogleLoginCustom from "~/components/GoogleLoginCustom";

const { Paragraph, Text, Link } = Typography;

const Login = () => {
  const onFinish = (values) => {
    // eslint-disable-next-line no-console
    console.log("Received values of form: ", values);
  };
  return (
    <Row justify="center" className="h-[100vh] bg-gray-50">
      <Col
        xs={18}
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
          <Divider>Or</Divider>
          <Text className="flex items-center mb-2 text-2xl font-semibold text-gray-900 dark:text-whit">
            Sign in
          </Text>
          <Paragraph className="text-center">
            Welcome back to Chat apps UI! Please enter your details below to
            sign in.
          </Paragraph>
          <Form
            name="normal_login"
            className="login-form w-full"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Username" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                type="password"
                placeholder="Password"
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
            <Form.Item className="text-center">
              <Text>{"Don't have an account?"}</Text>
              <Link href="/auth/register"> Sign up now</Link>
            </Form.Item>
          </Form>
        </Flex>
      </Col>
    </Row>
  );
};

export default Login;
