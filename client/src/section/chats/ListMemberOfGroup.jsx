import { Avatar, Button, Flex, Space } from 'antd';
import { IoArrowBackSharp } from 'react-icons/io5';
import { useDispatch, useSelector } from '~/store';
import { showContactInfo } from '~/store/slices/appSlice';
import { LuUserPlus } from 'react-icons/lu';
import { FiUserPlus } from 'react-icons/fi';

const ListMemberOfGroup = () => {
  const dispatch = useDispatch();
  const { currentConversation } = useSelector((state) => state.chat.chat);

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
        <Button type="primary" className="w-full" icon={<LuUserPlus />}>
          Add members
        </Button>
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
      <Button type="text" icon={<FiUserPlus />} shape="round" />
    </Flex>
  );
};

export default ListMemberOfGroup;
