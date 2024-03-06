import { Avatar, Button, Flex, Space } from "antd";
import { IoAdd } from "react-icons/io5";

const UserSearchItem = ({
  avatar,
  fullName,
  email,
  status,
  handleSelected
}) => {
  // handle
  const renderButton = () => {
    switch (status) {
    case 0:
      return (
        <Button
          type="primary"
          size="small"
          shape="circle"
          icon={<IoAdd size={22} />}
          onClick={handleSelected}
        />
      );
    case 1:
      return <p className="m-0 text-xs">Pending</p>;
    case 2:
      return <p className="m-0 text-xs">Friend</p>;
    default:
      return <></>;
    }
  };
  return (
    <Flex
      className={`py-2 cursor-pointer rounded`}
      align="center"
      justify="space-between"
    >
      <Space gap={12}>
        <Avatar size="large" src={avatar} />
        <Space direction="vertical" size={0}>
          <p className="m-0">{fullName}</p>
          <p className="m-0 text-xs text-gray-500">{email}</p>
        </Space>
      </Space>
      {renderButton()}
    </Flex>
  );
};

export default UserSearchItem;