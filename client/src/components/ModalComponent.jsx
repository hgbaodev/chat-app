import { Modal } from 'antd';

const modalStyles = {
  header: {
    padding: '16px 24px 8px'
  },
  body: {
    padding: 0
  },
  footer: {
  },
  content: {
    padding: 0
  },
};

const ModalComponent = ({ title, open, children, onCancel, ...props }) => {
  return (
    <Modal
      className='modal-custom'
      title={title}
      open={open}
      onCancel={onCancel}
      styles={modalStyles}
      {...props}
    >
      {children}
    </Modal>
  );
};

export default ModalComponent;
