import { Avatar, Badge, Button, Dropdown, Flex, Grid, Space } from 'antd';
import { IoArrowBackSharp, IoEllipsisHorizontal } from 'react-icons/io5';
import { useDispatch, useSelector } from '~/store';
import { showContactInfo } from '~/store/slices/appSlice';
import { LuUserPlus } from 'react-icons/lu';
import { useState } from 'react';
import AddMember from '~/section/chats/chat-info/AddMember';
const { useBreakpoint } = Grid;

const ListMemberOfGroup = () => {
  const dispatch = useDispatch();
  const { currentConversation } = useSelector((state) => state.chat.chat);
  const [isOpenAddMember, setOpenAddMember] = useState(false);
  const screens = useBreakpoint();
  // handle
  const handleReturnContactInfo = () => {
    dispatch(showContactInfo());
  };

  // render
  return (
    <Flex
      vertical
      className={`w-[350px] ${
        !screens.xl ? 'absolute bg-white right-0 bottom-0 top-0 border-l' : ''
      }`}
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

const MemberItem = ({ id, avatar, first_name, last_name, status }) => {
  const { currentConversation } = useSelector((state) => state.chat.chat);
  const handleDeleteFriend = () => {
    // logic here
  };

  const handleShowFriendDetail = () => {
    // logic here
    console.log('Show friend detail');
  };

  const dropdownItems = [
    {
      key: '1',
      label: 'View profile',
      onClick: handleShowFriendDetail
    },
    {
      key: '2',
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
        <Badge size="default" dot={status} color="green" offset={[0, 30]}>
          <Avatar src={avatar} size="large" />
        </Badge>
        <Space direction="vertical" size={2}>
          <p className="text-slate-900 font-semibold text-[13px] overflow-hidden whitespace-nowrap text-ellipsis max-w-[180px]">
            {first_name + ' ' + last_name}
          </p>
          {currentConversation.admin === id && <p className="text-xs">Admin</p>}
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
