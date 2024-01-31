import { Tabs } from "antd";
import {
  IoPeopleOutline,
  IoPersonAddOutline,
  IoPersonOutline,
} from "react-icons/io5";
import TabFriendsRequest from "~/section/contacts/friend-request/TabFriendsRequest";
import TabFriendsList from "~/section/contacts/friends-list/TabFriendsList";
import TabJoinedGroups from "~/section/contacts/joined-group/TabJoinedGroups";

const Contacts = () => {
  return (
    <Tabs
      className="contacts-tab"
      defaultActiveKey="2"
      tabPosition="left"
      items={[
        {
          key: "friends-list",
          label: `Friends List`,
          children: <TabFriendsList />,
          icon: <IoPersonOutline size={22} />,
        },
        {
          key: "joined-groups",
          label: `Joined Groups`,
          children: <TabJoinedGroups />,
          icon: <IoPeopleOutline size={22} />,
        },
        {
          key: "friend-requests",
          label: `Friend Requests`,
          children: <TabFriendsRequest />,
          icon: <IoPersonAddOutline size={22} />,
        },
      ]}
    />
  );
};

export default Contacts;
