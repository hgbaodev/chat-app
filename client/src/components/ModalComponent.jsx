import { Modal } from 'antd';

const ModalComponent = ({
  title,
  open,
  children,
  onCancel,
  BorderHeader = false,
  BorderFooter = false,
  ...props
}) => {
  const modalStyles = {
    header: {
      padding: '16px 20px 8px',
      borderBottom: BorderHeader ? '1px solid #edebeb' : ''
    },
    body: {
      padding: 0
    },
    content: {
      padding: 0
    },
    footer: {
      marginTop: 0,
      borderTop: BorderFooter ? '1px solid #edebeb' : ''
    }
  };
  return (
    <Modal
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
