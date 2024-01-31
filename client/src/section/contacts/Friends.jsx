import { Flex, Input, Select } from 'antd';
import { IoSearchOutline } from 'react-icons/io5';
import FriendItem from './FriendItem';
const Friends = () => {
  return (
    <>
      <Flex align="center" className="h-[60px] p-4" style={{ boxShadow: '0px 0px 2px rgba(0,0,0,.2)' }}>
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
      <div className="">
        <FriendItem />
        <FriendItem />
        <FriendItem />
      </div>
    </>
  );
};
export default Friends;
