import { Button, Divider, Flex, Grid, Modal, Space, Typography } from 'antd';
import Title from 'antd/es/typography/Title';
import { CloseOutlined } from '@ant-design/icons';
import { IoChevronForward } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import {
  showMembersGroup,
  showSharedMessage,
  toggleContactInfo
} from '~/store/slices/appSlice';
import { GrGroup, GrPin } from 'react-icons/gr';
import { AiOutlineEdit } from 'react-icons/ai';
import { ExclamationCircleFilled } from '@ant-design/icons';
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
import { RiUnpinLine } from 'react-icons/ri';
import {
  leaveConversation,
  pinConversation,
  setOpenPinnedMessage,
  unPinConversation
} from '~/store/slices/chatSlice';
import AvatarImage from '~/section/users/AvatarImage';
import { useMemo } from 'react';
import { setOpenChangeNameConversation } from '~/store/slices/contactSlice';
import { setOpenProfile } from '~/store/slices/relationshipSlice';
const { useBreakpoint } = Grid;
const { confirm } = Modal;

export const ContactInfo = () => {
  const dispatch = useDispatch();
  const { currentConversation } = useSelector((state) => state.chat.chat);
  const screens = useBreakpoint();

  const handleClose = () => dispatch(toggleContactInfo());
  const handleOpenSharedMessages = () => dispatch(showSharedMessage());
  const handleOpenChangeNameCOnversation = () =>
    dispatch(setOpenChangeNameConversation(true));

  return (
    <>
      <Flex
        vertical
        className={`w-[300px] ${
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
            <AvatarImage size={64} sizeGroup={45} />
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
                onClick={handleOpenChangeNameCOnversation}
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

          <Divider className="mb-2 mt-0" />

          <Flex
            justify="space-between"
            align="center"
            className="cursor-pointer"
            onClick={() => dispatch(setOpenPinnedMessage(true))}
          >
            <Typography className="font-semibold m-0">
              View pinned messages
            </Typography>
            <Button
              type="text"
              shape="circle"
              icon={<IoChevronForward size={20} />}
            />
          </Flex>
          <Divider className="my-2" />
          <Flex
            justify="space-between"
            align="center"
            className="cursor-pointer"
            onClick={handleOpenSharedMessages}
          >
            <Typography className="font-semibold m-0">
              Media, files and links
            </Typography>
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
    </>
  );
};

const AboutSection = () => {
  const { currentConversation } = useSelector((state) => state.chat.chat);
  const { user } = useSelector((state) => state.auth);

  const member = useMemo(
    () => currentConversation.members.filter((m) => m.id !== user.id)[0],
    [currentConversation, user]
  );

  return (
    <>
      <Typography className="font-semibold mb-2">About</Typography>
      <Typography>{member.about ? member.about : 'No bio yet'}</Typography>
    </>
  );
};

const MembersSection = () => {
  const dispatch = useDispatch();
  const { currentConversation } = useSelector((state) => state.chat.chat);
  return (
    <>
      <Typography className="font-semibold m-0">Members</Typography>
      <ContactInfoItem
        icon={<LuUsers size={20} />}
        title={`${currentConversation.members.length} members`}
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
  const dispatch = useDispatch();
  const { currentConversation } = useSelector((state) => state.chat.chat);
  const { user } = useSelector((state) => state.auth);

  const handlePin = () => {
    dispatch(pinConversation(currentConversation.id));
  };

  const handleUnPin = () => {
    dispatch(unPinConversation(currentConversation.id));
  };

  const member = useMemo(
    () => currentConversation.members.filter((m) => m.id !== user.id)[0],
    [currentConversation, user]
  );

  const showDeleteConfirm = () => {
    confirm({
      title: 'Leave converstaion',
      icon: <ExclamationCircleFilled />,
      content: 'Are you leave this conversation?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        dispatch(leaveConversation(currentConversation.id));
      },
      onCancel() {
        console.log('Cancel');
      }
    });
  };
  return (
    <Flex>
      {currentConversation.type === ConversationTypes.FRIEND && (
        <>
          <ToolButton
            icon={<LuUser />}
            text="Profile"
            onClick={() => dispatch(setOpenProfile(member.id))}
          />
          <ToolButton icon={<GrGroup />} text="Create group" />
        </>
      )}
      {!currentConversation.is_pinned ? (
        <ToolButton icon={<GrPin />} text="Pin" onClick={handlePin} />
      ) : (
        <ToolButton icon={<RiUnpinLine />} text="Unpin" onClick={handleUnPin} />
      )}
      {currentConversation.type === ConversationTypes.GROUP && (
        <ToolButton
          icon={<LuLogOut />}
          text="Leave group"
          onClick={showDeleteConfirm}
        />
      )}
    </Flex>
  );
};

const PrivacySection = () => {
  return (
    <>
      <Typography className="font-semibold mb-2">Privacy settings</Typography>
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

const ToolButton = ({ text, icon, onClick }) => {
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
        onClick={onClick}
      />
      <span className="text-xs text-gray-500">{text}</span>
    </Space>
  );
};
