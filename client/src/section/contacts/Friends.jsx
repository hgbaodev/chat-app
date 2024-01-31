import { Flex, Input, Select } from 'antd';
import { FriendItem } from './FriendItem';
import { IoSearchOutline } from 'react-icons/io5';
const Friends = () => {
  return (
    <>
      <Flex align="center" className="h-[53px] p-4" style={{ boxShadow: '0px 1px 1px rgba(0,0,0,.1)' }}>
        <p className="font-semibold">Friends (20)</p>
      </Flex>
      <Flex className="p-4" gap={10}>
        <Input placeholder="Search friends" prefix={<IoSearchOutline />} className="w-[350px]" />
        <Select
          className="w-[250px]"
          defaultValue="asc"
          options={[
            { value: 'asc', label: 'Name (A-Z)' },
            { value: 'desc', label: 'Name (Z-A)' },
          ]}
        />
      </Flex>
      <FriendItem />
      <FriendItem />
      <FriendItem />
    </>
  );
};
export default Friends;
