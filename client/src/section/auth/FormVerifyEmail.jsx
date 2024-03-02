import { Button, Form, Input, message, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from '~/store';
import { verifyEmail } from '~/store/slices/authSlice';
import { formatErrors } from '~/utils/formatErrors';
import { useSelector } from 'react-redux';

const { Text } = Typography;

const FormVerifyEmail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { isLoading } = useSelector((state) => state.auth.verifyEmail);

  const onFinish = async (values) => {
    const response = await dispatch(verifyEmail(values));
    console.log(response);
    if (response.error && response.payload) {
      form.setFields(formatErrors(response.payload));
    } else {
      navigate('/');
      message.success('Account verified successfully');
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
        label="Enter your OTP"
        name="otp"
        validateTrigger="onBlur"
        rules={[
          {
            required: true,
            whitespace: true,
            message: 'Please input your OTP!'
          },
          { min: 6, message: 'Code must be at least 6 characters' }
        ]}
      >
        <Input placeholder="6 characters" variant="filled" size="large" />
      </Form.Item>
      <Form.Item className="mb-4">
        <Button
          type="primary"
          htmlType="submit"
          className="w-full"
          size="large"
          loading={isLoading}
        >
          Verify
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

export default FormVerifyEmail