import { Button, Form, Input, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { useDispatch } from '~/store';
import { forgotPassword } from '~/store/slices/authSlice';
import { formatErrors } from '~/utils/formatErrors';
import { useSelector } from 'react-redux';

const { Text } = Typography;
const FormForgetPassword = () => {
  const { isLoadingSendForgotPassword } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    const response = await dispatch(forgotPassword(values['email']));
    if (response.error && response.payload) {
      form.setFields(formatErrors(response.payload));
    }
  };
  return (
    <Form
      form={form}
      initialValues={{ remember: true }}
      layout="vertical"
      requiredMark="optional"
      onFinish={onFinish}
      className="w-full"
    >
      <Form.Item
        className="mb-8"
        label="Enter the email registered in the system"
        name="email"
        validateTrigger="onBlur"
        rules={[
          {
            required: true,
            whitespace: true,
            message: 'Please input your email!'
          },
          { type: 'email', message: 'Please enter a valid email address' }
        ]}
      >
        <Input
          placeholder="Please enter your email"
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
          loading={isLoadingSendForgotPassword}
        >
          Submit
        </Button>
      </Form.Item>
      <Form.Item className="mb-0 text-center">
        <Text className="text-sm">
          Don’t have a code? <Link to="#">Resend code</Link>
        </Text>
      </Form.Item>
    </Form>
  );
};

export default FormForgetPassword;
