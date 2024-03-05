import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Typography
} from 'antd';

import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '~/store';
import { register } from '~/store/slices/authSlice';
import { formatErrors } from '~/utils/formatErrors';

const { Text } = Typography;

const FormRegister = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { isLoadingRegister } = useSelector((state) => state.auth);

  const onFinish = async (values) => {
    const response = await dispatch(register(values));
    if (response.error && response.payload) {
      form.setFields(formatErrors(response.payload));
    } else {
      localStorage.setItem('verify_email', values.email);
      navigate('/auth/verify-email');
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
            <Input placeholder="Jeff" variant="filled" size="large" />
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
            <Input placeholder="Bezos" variant="filled" size="large" />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        label="Email"
        name="email"
        validateTrigger="onBlur"
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
        validateTrigger="onBlur"
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
          loading={isLoadingRegister}
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

export default FormRegister;