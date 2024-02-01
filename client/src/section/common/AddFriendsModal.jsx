import { Modal } from 'antd';

const AddFriendsModal = ({ isModalOpen, setIsModalOpen }) => {
  const handleClose = () => {
    setIsModalOpen(false);
  };
  return (
    <Modal
      title="Add friend"
      open={isModalOpen}
      onOk={handleClose}
      onCancel={handleClose}
    >
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Modal>
  );
};

export default AddFriendsModal;
