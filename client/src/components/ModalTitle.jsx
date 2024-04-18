import { Button, Flex } from 'antd';
import { IoChevronBack } from 'react-icons/io5';

const ModalTitle = ({ title, onClick }) => {
  return (
    <Flex align="center" gap={8}>
      <Button
        type="text"
        shape="circle"
        size="small"
        icon={<IoChevronBack size={18} />}
        onClick={onClick}
      />
      {title}
    </Flex>
  );
};

export default ModalTitle;
