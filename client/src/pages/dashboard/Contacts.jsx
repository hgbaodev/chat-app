import { Tabs } from 'antd';
import { IoPeopleOutline, IoPersonAddOutline, IoPersonOutline } from 'react-icons/io5';
import FriendRequests from '~/section/contacts/FriendRequests';
import Friends from '~/section/contacts/Friends';
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
          children: <Friends />,
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

export default Contacts;
