import { Modal } from 'antd';

const AddMember = ({ open, onClose }) => {
  return (
    <Modal
      title="Add members"
      open={open}
      //   onOk={handleOk}
      onCancel={onClose}
    >
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Modal>
  );
};

export default AddMember;
