import { Modal, message } from 'antd';
import { Button, Form, Input } from 'antd';
import { useDispatch } from '~/store';
import { changePassword } from '~/store/slices/authSlice';
import { formatErrors } from '~/utils/formatErrors';

const ChangePasswordModal = ({ isOpen, handleClose }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const handleCancel = () => {
    handleClose(false);
  };

  const onFinish = async (values) => {
    const response = await dispatch(changePassword(values));
    if (response.error && response.payload) {
      form.setFields(formatErrors(response.payload));
    } else {
      messageApi.open({
        type: 'success',
        content: 'Password has been changed successfully.'
      });
      form.resetFields();
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="Change Password"
        open={isOpen}
        onCancel={handleCancel}
        width={400}
        footer={null}
      >
        <p className="mb-4 text-sm text-gray-600 italic">
          Change your password to keep your account secure.
        </p>
        <Form
          form={form}
          layout="vertical"
          className="w-full"
          requiredMark="optional"
          onFinish={onFinish}
        >
          <Form.Item
            label="Current password"
            name="current_password"
            validateTrigger="onBlur"
            rules={[
              {
                required: true,
                message: 'Please input current password!'
              },
              {
                min: 6,
                message: 'Please current password min 6 characters'
              }
            ]}
          >
            <Input.Password
              type="password"
              placeholder="Enter current password"
              variant="filled"
            />
          </Form.Item>
          <Form.Item
            label="New password"
            name="new_password"
            validateTrigger="onBlur"
            rules={[
              {
                required: true,
                message: 'Please input new password!'
              },
              {
                min: 6,
                message: 'Please new password min 6 characters'
              }
            ]}
          >
            <Input.Password
              type="password"
              placeholder="Enter new password"
              variant="filled"
            />
          </Form.Item>
          <Form.Item
            label="Confirm new password"
            name="confirm_password"
            validateTrigger="onBlur"
            rules={[
              {
                required: true,
                message: 'Please input confirm new password!'
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('new_password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      'The two passwords that you entered do not match!'
                    )
                  );
                }
              })
            ]}
          >
            <Input.Password
              type="password"
              placeholder="Confirm new password"
              variant="filled"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ChangePasswordModal;
