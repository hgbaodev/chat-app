import { Button, Flex, Form, Input } from 'antd';
import { Link } from 'react-router-dom';
import { useDispatch } from '~/store';
import { forgotPassword } from '~/store/slices/authSlice';
import { formatErrors } from '~/utils/formatErrors';
import { useSelector } from 'react-redux';
import { IoArrowBack } from 'react-icons/io5';

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
        label="Enter address"
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
          placeholder="Enter email address"
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
        <Link to="/auth/login">
          <Flex align="center" justify="center" gap={10}>
            <IoArrowBack /> <span>Return to sign in</span>
          </Flex>
        </Link>
      </Form.Item>
    </Form>
  );
};

export default FormForgetPassword;
