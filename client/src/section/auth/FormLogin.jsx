import { Button, Checkbox, Form, Input, Typography } from 'antd';

import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '~/store';
import { login } from '~/store/slices/authSlice';
import { toast } from 'react-toastify';

const { Text } = Typography;

const FormLogin = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { isLoadingLogin } = useSelector((state) => state.auth);
  const onFinish = async (values) => {
    const response = await dispatch(login(values));
    if (response.error && response.payload) {
      toast.error(response.payload?.detail);
    } else {
      navigate('/');
    }
  };
  return (
    <Form
      form={form}
      layout="vertical"
      className="w-full"
      initialValues={{ remember: true }}
      requiredMark="optional"
      onFinish={onFinish}
    >
      <Form.Item
        label="Email"
        name="email"
        validateTrigger="onBlur"
        rules={[
          { required: true, message: 'Please input your username!' },
          { type: 'email', message: 'Email is not valid' }
        ]}
      >
        <Input placeholder="Email address" variant="filled" size="large" />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        validateTrigger="onBlur"
        rules={[
          {
            required: true,
            message: 'Please input your password!'
          },
          {
            min: 6,
            message: 'Please password min 6 characters'
          }
        ]}
      >
        <Input.Password
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
        <Button
          type="primary"
          htmlType="submit"
          className="w-full"
          size="large"
          loading={isLoadingLogin}
        >
          Login
        </Button>
      </Form.Item>
      <Form.Item className="text-center">
        <Text>{"Don't have an account?"}</Text>
        <Link to="/auth/register"> Sign up now</Link>
      </Form.Item>
    </Form>
  );
};

export default FormLogin;
