import {
  Button,
  Flex,
  Form,
  Input,
  Modal,
  Typography,
  notification
} from 'antd';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AvatarImage from '~/section/users/AvatarImage';
import {
  changeNameConversation,
  setOpenChangeNameConversation
} from '~/store/slices/contactSlice';

const ChangeNameConversationModal = () => {
  const [form] = Form.useForm();
  const { currentConversation } = useSelector((state) => state.chat.chat);
  const { openChangeNameConversation, isLoadingChangeNameConversation } =
    useSelector((state) => state.contact);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(setOpenChangeNameConversation(false));
  };
  const onFinish = async (values) => {
    values['id'] = currentConversation.id;
    try {
      await dispatch(changeNameConversation(values));
      notification.success({
        message: 'Success',
        description: 'Conversation name changed successfully.'
      });
    } catch (error) {
      console.error('Error:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to change conversation name.'
      });
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  useEffect(() => {
    if (openChangeNameConversation) {
      form.setFieldsValue({ title: currentConversation.title });
    }
  }, [form, currentConversation, openChangeNameConversation]);

  return (
    <Modal
      title="Set group name"
      open={openChangeNameConversation}
      className="mt-[60px]"
      footer={null}
      onCancel={handleClose}
      style={{ maxWidth: 500 }}
    >
      <Flex justify="center">
        <AvatarImage size={64} sizeGroup={45} />
      </Flex>
      <Form
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        className="mt-2"
      >
        <Flex vertical gap="middle">
          <Typography.Text style={{ textAlign: 'center' }}>
            Are you sure you want to rename this group, a new group name will be
            visible with all members
          </Typography.Text>
          <Form.Item
            name="title"
            rules={[
              {
                required: true,
                message: 'Please input your title!'
              },
              {
                min: 3,
                message: 'Title must be at least 3 characters'
              }
            ]}
          >
            <Input />
          </Form.Item>
          <Flex justify="end">
            <Button style={{ marginRight: 8 }} onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoadingChangeNameConversation}
            >
              Update
            </Button>
          </Flex>
        </Flex>
      </Form>
    </Modal>
  );
};

export default ChangeNameConversationModal;
