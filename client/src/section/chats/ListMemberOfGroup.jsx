import { Avatar, Button, Dropdown, Flex, Space } from 'antd';
import { IoArrowBackSharp, IoEllipsisHorizontal } from 'react-icons/io5';
import { useDispatch, useSelector } from '~/store';
import { showContactInfo } from '~/store/slices/appSlice';
import { LuUserPlus } from 'react-icons/lu';
import { useState } from 'react';
import AddMember from '~/section/chats/AddMember';

const ListMemberOfGroup = () => {
  const dispatch = useDispatch();
  const { currentConversation } = useSelector((state) => state.chat.chat);
  const [isOpenAddMember, setOpenAddMember] = useState(false);
  // handle
  const handleReturnContactInfo = () => {
    dispatch(showContactInfo());
  };

  // render
  return (
    <Flex
      vertical
      className="w-[350px]"
      style={{ boxShadow: '0px 0px 2px rgba(0,0,0,.1)' }}
    >
      <Flex
        gap={10}
        align="center"
        className="w-full h-[60px] px-4"
        style={{ boxShadow: '0px 0px 2px rgba(0,0,0,.1)' }}
      >
        <Button
          type="text"
          shape="circle"
          icon={<IoArrowBackSharp size={18} />}
          size={20}
          onClick={handleReturnContactInfo}
        />
        <p className="m-0 font-semibold">Members</p>
      </Flex>
      <Space className="p-4" direction="vertical">
        <Button
          type="primary"
          className="w-full"
          icon={<LuUserPlus />}
          onClick={() => setOpenAddMember(true)}
        >
          Add members
        </Button>
        <AddMember
          open={isOpenAddMember}
          onClose={() => setOpenAddMember(false)}
        />
        <Flex vertical>
          {currentConversation.members.map((member) => (
            <MemberItem key={member.id} {...member} />
          ))}
        </Flex>
      </Space>
    </Flex>
  );
};

const MemberItem = ({ avatar, first_name, last_name }) => {
  const handleDeleteFriend = () => {
    // logic here
  };

  const handleShowFriendDetail = () => {
    // logic here
    console.log('Show friend detail');
  };

  const handleChatFriend = () => {
    // logic here
    console.log('chat friend');
  };

  const dropdownItems = [
    {
      key: '1',
      label: 'Chat now',
      onClick: handleChatFriend
    },
    {
      key: '2',
      label: 'View profile',
      onClick: handleShowFriendDetail
    },
    {
      key: '3',
      label: 'Delete',
      onClick: handleDeleteFriend,
      danger: true
    }
  ];
  return (
    <Flex
      className="p-2 ps-0 cursor-pointer"
      justify="space-between"
      align="center"
    >
      <Space>
        <Avatar src={avatar} />
        <Space>
          <p className="text-slate-900 text-[13px] overflow-hidden whitespace-nowrap text-ellipsis max-w-[180px]">
            {first_name + ' ' + last_name}
          </p>
        </Space>
      </Space>
      <Dropdown
        menu={{ items: dropdownItems }}
        placement="bottomLeft"
        trigger={['click']}
        arrow={true}
      >
        <Button type="text" icon={<IoEllipsisHorizontal />} size="small" />
      </Dropdown>
    </Flex>
  );
};

export default ListMemberOfGroup;
