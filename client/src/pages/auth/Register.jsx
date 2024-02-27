import { Button, Checkbox, Form, Input, Typography } from 'antd';
import validator from 'validator';

const { Text } = Typography;

const validateEmail = (rule, value, callback) => {
  if (value && !validator.isEmail(value)) {
    callback('Please enter a valid email!');
  } else {
    callback();
  }
};

const Register = () => {
  const onFinish = (values) => {
    // eslint-disable-next-line no-console
    console.log('Received values of form: ', values);
  };
  return (
    <>
      <Text className="flex items-center mb-2 text-2xl font-semibold text-gray-900 dark:text-whit">
        Sign up
      </Text>
      <Form
        name="form_register"
        layout="vertical"
        className="login-form w-full mb-0"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          label="Full Name"
          name="fullname"
          rules={[{ required: true, message: 'Please input your full name!' }]}
        >
          <Input placeholder="Please enter full name" variant="filled" />
        </Form.Item>
        <Form.Item
          label="Gmail"
          name="gmail"
          rules={[
            { required: true, message: 'Please input your gmail!' },
            { validator: validateEmail }
          ]}
        >
          <Input placeholder="Please enter Email" variant="filled" />
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
        <Form.Item
          label="Confirm password"
          name="confirmpassword"
          rules={[
            {
              required: true,
              message: 'Please input your confirm password!'
            }
          ]}
        >
          <Input.Password
            type="password"
            placeholder="confirmpassword"
            variant="filled"
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="terms" valuePropName="checked" noStyle>
            <Checkbox>I accept all terms & conditions</Checkbox>
          </Form.Item>
        </Form.Item>
        <Form.Item className="mb-0">
          <Button type="primary" htmlType="submit" className="w-full">
            Register
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default Register;
