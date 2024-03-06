import { Avatar, Button, Flex, Image, Modal, Space, Typography } from 'antd';
import { AiOutlineEdit } from 'react-icons/ai';

const { Text } = Typography;

const ProfileModal = ({ open, setOpen }) => {
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Modal
      title="Account Information"
      open={open}
      onCancel={handleClose}
      footer={
        <Button
          type="text"
          size="middle"
          icon={<AiOutlineEdit />}
          className="w-full"
        >
          Edit
        </Button>
      }
      width={500}
    >
      <Flex vertical>
        <Image
          height={150}
          src="https://res.cloudinary.com/dw3oj3iju/image/upload/v1709748276/chat_app/t0aytyt93yhgj5yb3fce.jpg"
        />
        <Space>
          <Avatar
            style={{
              marginTop: '-20px',
              borderStyle: 'solid',
              borderWidth: '2px',
              borderColor: 'white'
            }}
            draggable={true}
            alt="Avatar"
            size={64}
            src="https://res.cloudinary.com/dw3oj3iju/image/upload/v1709628794/chat_app/b6pswhnwsreustbzr8d0.jpg"
          />
          <Text strong>Hoàng Gia Bảo</Text>
        </Space>
      </Flex>
    </Modal>
  );
};

export default ProfileModal;
