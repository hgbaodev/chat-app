import { Button, Flex, Input, Select, Tabs } from 'antd';
import { IoPeopleOutline, IoPersonAddOutline, IoPersonOutline, IoSearchOutline } from 'react-icons/io5';
import FriendItem from '~/section/contacts/FriendItem';
import FriendRequests from '~/section/contacts/FriendRequests';
import Groups from '~/section/contacts/Groups';

const Contacts = () => {
  return (
    <Tabs
      className="contacts-tab"
      defaultActiveKey="2"
      tabPosition="left"
      items={[
        {
          key: 'friends-list',
          label: `Friends List`,
          children: <TabFriendsList />,
          icon: <IoPersonOutline size={22} />,
        },
        {
          key: 'joined-groups',
          label: `Joined Groups`,
          children: <Groups />,
          icon: <IoPeopleOutline size={22} />,
        },
        {
          key: 'friend-requests',
          label: `Friend Requests`,
          children: <FriendRequests />,
          icon: <IoPersonAddOutline size={22} />,
        },
      ]}
    />
  );
};

const TabFriendsList = () => {
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
      <div className="px-2">
        <FriendItem />
      </div>
    </>
  );
};

export default Contacts;
