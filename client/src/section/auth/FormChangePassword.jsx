import { Button, Form, Input } from 'antd';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '~/store';
import { resetPassword } from '~/store/slices/authSlice';

const FormChangePassword = () => {
  const [form] = Form.useForm();
  const { isLoadingChangePassword } = useSelector((state) => state.auth);
  const { token } = useParams();
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    values['token'] = token.split('=')[1];
    dispatch(resetPassword(values));
  };
  return (
    <>
      <Form
        form={form}
        layout="vertical"
        className="w-full"
        requiredMark="optional"
        onFinish={onFinish}
      >
        <Form.Item
          label="New Password"
          name="password"
          validateTrigger="onBlur"
          rules={[
            {
              required: true,
              message: 'Please input your new password!'
            },
            {
              min: 6,
              message: 'Please new password min 6 characters'
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
        <Form.Item
          label="Confirm Password"
          name="confirm_password"
          validateTrigger="onBlur"
          rules={[
            {
              required: true,
              message: 'Please confirm your new password!'
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('The two passwords that you entered do not match!')
                );
              }
            })
          ]}
        >
          <Input.Password
            type="password"
            placeholder="Confirm Password"
            variant="filled"
            size="large"
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full"
            size="large"
            loading={isLoadingChangePassword}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default FormChangePassword;
