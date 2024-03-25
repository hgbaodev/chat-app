import { Avatar, Button, Divider, Flex, Grid, Space, Typography } from 'antd';
import Title from 'antd/es/typography/Title';
import { CloseOutlined } from '@ant-design/icons';
import { IoChevronForward } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import {
  showMembersGroup,
  showSharedMessage,
  toggleContactInfo
} from '~/store/slices/appSlice';
import { faker } from '@faker-js/faker';
import { GrGroup, GrPin } from 'react-icons/gr';
import { AiOutlineEdit } from 'react-icons/ai';
import { useSelector } from '~/store';
import {
  LuAlertOctagon,
  LuBan,
  LuLogOut,
  LuTrash2,
  LuUser,
  LuUsers
} from 'react-icons/lu';
import { ConversationTypes } from '~/utils/enum';
const { useBreakpoint } = Grid;

export const ContactInfo = () => {
  const dispatch = useDispatch();
  const { currentConversation } = useSelector((state) => state.chat.chat);
  const screens = useBreakpoint();

  const handleClose = () => dispatch(toggleContactInfo());
  const handleOpenSharedMessages = () => dispatch(showSharedMessage());

  return (
    <Flex
      vertical
      className={`w-[350px] ${
        !screens.xl ? 'absolute bg-white right-0 bottom-0 top-0 border-l' : ''
      }`}
      style={{ boxShadow: '0px 0px 2px rgba(0,0,0,.1)' }}
    >
      <Flex
        justify="space-between"
        align="center"
        className="w-full h-[60px] px-4"
        style={{ boxShadow: '0px 0px 2px rgba(0,0,0,.1)' }}
      >
        <p className="m-0 font-semibold">Contact Information</p>
        <Button
          type="text"
          shape="circle"
          icon={<CloseOutlined />}
          size={20}
          onClick={handleClose}
        />
      </Flex>
      <Space
        className="p-4 w-full overflow-y-auto h-[calc(100vh-60px)] scrollbar"
        direction="vertical"
      >
        <Space className="w-full" direction="vertical" align="center">
          <Avatar size={64} src={currentConversation.image} />
          <Space align="center" className="mb-4">
            <Title level={5} className="!m-0">
              {currentConversation.title}
            </Title>
            <Button
              type="text"
              size="small"
              shape="circle"
              icon={<AiOutlineEdit />}
              className="bg-neutral-100"
            />
          </Space>
          <HeaderInfoTool />
        </Space>

        <Divider className="my-2" />

        {currentConversation.type === ConversationTypes.FRIEND ? (
          <AboutSection />
        ) : (
          <MembersSection />
        )}

        <Divider className="my-2" />
        <Flex justify="space-between" align="center">
          <Typography className="font-bold m-0">
            Media, Links and Docs
          </Typography>
          <Button
            type="text"
            shape="circle"
            icon={<IoChevronForward size={20} />}
            onClick={handleOpenSharedMessages}
          />
        </Flex>

        <Divider className="my-2" />
        <Flex justify="space-between" align="center">
          <Typography className="font-bold m-0">Starred Messages</Typography>
          <Button
            type="text"
            shape="circle"
            icon={<IoChevronForward size={20} />}
          />
        </Flex>

        <Divider className="my-2" />
        <PrivacySection />
      </Space>
    </Flex>
  );
};

const AboutSection = () => {
  return (
    <>
      <Typography className="font-bold mb-2">About</Typography>
      <Typography>{faker.lorem.sentence()}</Typography>
    </>
  );
};

const MembersSection = () => {
  const dispatch = useDispatch();
  return (
    <>
      <Typography className="font-bold m-0">Members</Typography>
      <ContactInfoItem
        icon={<LuUsers size={20} />}
        title="99 members"
        onClick={() => dispatch(showMembersGroup())}
      />
    </>
  );
};

const ContactInfoItem = ({ icon, title, danger, ...props }) => {
  return (
    <Flex
      className={`cursor-pointer py-3 ${danger ? 'text-red-600' : ''}`}
      align="center"
      gap={12}
      {...props}
    >
      {icon}
      <span className="text-inherit text-sm">{title}</span>
    </Flex>
  );
};

const HeaderInfoTool = () => {
  const { currentConversation } = useSelector((state) => state.chat.chat);
  return (
    <Flex>
      {currentConversation.type === ConversationTypes.FRIEND && (
        <>
          <ToolButton icon={<LuUser />} text="Profile" />
          <ToolButton icon={<GrGroup />} text="Create group" />
        </>
      )}
      <ToolButton icon={<GrPin />} text="Pin" />
      {currentConversation.type === ConversationTypes.GROUP && (
        <ToolButton icon={<LuLogOut />} text="Leave group" />
      )}
    </Flex>
  );
};

const PrivacySection = () => {
  return (
    <>
      <Typography className="font-bold m-0">Privacy settings</Typography>
      <Flex vertical>
        <ContactInfoItem
          icon={<LuTrash2 size={20} />}
          title="Delete chat history"
          danger
        />
        <ContactInfoItem icon={<LuBan size={20} />} title="Block contact" />
        <ContactInfoItem icon={<LuAlertOctagon size={20} />} title="Report" />
      </Flex>
    </>
  );
};

const ToolButton = ({ text, icon }) => {
  return (
    <Space
      direction="vertical"
      align="center"
      className="w-[74px] h-[78px] text-center"
    >
      <Button
        type="text"
        size="middle"
        shape="circle"
        icon={icon}
        className="bg-neutral-100"
      />
      <span className="text-xs text-gray-500">{text}</span>
    </Space>
  );
};
