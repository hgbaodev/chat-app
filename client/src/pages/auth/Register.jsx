/* eslint-disable no-console */
import {
  Button,
  Form,
  Input,
  Flex,
  Row,
  Typography,
  Col,
  Divider,
  Space
} from 'antd';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useDispatch } from '~/store';
import { register } from '~/store/slices/authSlice';
import { formatErrors } from '~/utils/formatErrors';

const { Text, Paragraph } = Typography;

const RegisterPage = () => {
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
          className="w-full mx-auto bg-white rounded-lg p-6"
        >
          <Text className="text-2xl font-medium">Sign Up to Chat App</Text>
          <Paragraph className="text-center text-xs text-gray-500">
            Already a member ? <Link to="/auth/login"> Sign In</Link>
          </Paragraph>

          <Space>
            <Button shape="round" icon={<FcGoogle />} size="large">
              Google
            </Button>
            <Button shape="round" icon={<FaGithub />} size="large">
              Github
            </Button>
          </Space>
          <Divider>Or</Divider>
          <FormLogin />
        </Flex>
      </Col>
    </Row>
  );
};

const FormLogin = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const response = await dispatch(register(values));
    if (response.error && response.payload) {
      form.setFields(formatErrors(response.payload));
    } else {
      console.log('ok');
    }
  };

  return (
    <Form
      form={form}
      initialValues={{ remember: true }}
      layout="vertical"
      requiredMark="optional"
      onFinish={onFinish}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="First Name"
            name="first_name"
            rules={[
              {
                required: true,
                whitespace: true,
                message: 'Please input your first name!'
              }
            ]}
          >
            <Input placeholder="Nhat" variant="filled" size="large" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Last Name"
            name="last_name"
            rules={[
              {
                required: true,
                whitespace: true,
                message: 'Please input your last name!'
              }
            ]}
          >
            <Input placeholder="Sinh" variant="filled" size="large" />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: 'Please input your email!' },
          { type: 'email', message: 'Email is not valid' }
        ]}
      >
        <Input placeholder="abc@email.com" variant="filled" size="large" />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your password!'
          },
          {
            min: 6
          }
        ]}
      >
        <Input.Password
          type="password"
          placeholder="6+ characters"
          variant="filled"
          size="large"
        />
      </Form.Item>
      <Form.Item className="mb-4">
        <Button
          type="primary"
          htmlType="submit"
          className="w-full"
          size="large"
        >
          Create Account
        </Button>
      </Form.Item>
      <Form.Item className="mb-0 text-center">
        <Text className="text-xs">
          By signing up, I agree to <Link to="#">Terms of Service</Link> and{' '}
          <Link to="#">Privacy Policy</Link>.
        </Text>
      </Form.Item>
    </Form>
  );
};

export default RegisterPage;
