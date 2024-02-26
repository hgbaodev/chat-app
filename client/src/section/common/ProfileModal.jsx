import { Modal } from 'antd';

const ProfileModal = ({ isModalOpen, setIsModalOpen }) => {
  const handleClose = () => {
    setIsModalOpen(false);
  };
  return (
    <Modal
      title="Profile"
      open={isModalOpen}
      onCancel={handleClose}
      footer={null}
      width={400}
    >
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem sit iusto
      velit consequatur libero ad minima aut, est vitae saepe, ut maxime
      dolorum, asperiores vel? Numquam voluptate voluptas, molestiae iusto ex
      reprehenderit id itaque. Facilis exercitationem expedita ullam alias
      suscipit dolorem recusandae animi consequuntur repudiandae temporibus
      officiis, minima corporis quam aspernatur accusantium? Assumenda esse
      neque quisquam exercitationem laborum laudantium, reprehenderit ipsa
      aliquid voluptatibus in doloribus harum ratione modi odio fugit qui
      tempora odit veniam animi molestiae deleniti architecto nulla magnam.
      Molestiae distinctio voluptatum nihil in nemo, natus similique sunt,
      quidem unde iusto animi neque, quod minima voluptates cum excepturi modi?
    </Modal>
  );
};

export default ProfileModal;
