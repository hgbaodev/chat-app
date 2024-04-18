import { Avatar, Flex, Space } from 'antd';
import { useDispatch } from 'react-redux';
import { setProfileId } from '~/store/slices/relationshipSlice';

const UserSearchItem = ({ id, avatar, fullName, setViewType }) => {
  const dispatch = useDispatch();
  const handleClick = () => {
    setViewType('profile');
    dispatch(setProfileId(id));
  };

  return (
    <Flex
      className={`py-2 cursor-pointer rounded`}
      align="center"
      justify="space-between"
      onClick={handleClick}
    >
      <Space gap={12}>
        <Avatar size="large" src={avatar} />
        <Space direction="vertical" size={0}>
          <p className="m-0">{fullName}</p>
        </Space>
      </Space>
    </Flex>
  );
};

export default UserSearchItem;
