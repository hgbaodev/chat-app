import { Avatar, Flex, Image, Space, Typography, Button, Tooltip } from 'antd';
import { useEffect } from 'react';
import { IoArrowUndoSharp } from 'react-icons/io5';
import { LuMessagesSquare, LuUserPlus } from 'react-icons/lu';
import { useDispatch, useSelector } from '~/store';
import { showContactInfo } from '~/store/slices/appSlice';
import { getConversationUserId } from '~/store/slices/chatSlice';
import {
  acceptFriendRequest,
  deleteFriendRequest,
  getProfile,
  setCloseProfile
} from '~/store/slices/relationshipSlice';
const { Text, Title } = Typography;

const ProfileInfo = ({ changeView }) => {
  const { info, id } = useSelector((state) => state.relationship.profile);
  const currentUserId = useSelector((state) => state.auth.user.id);
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) dispatch(getProfile(id));
  }, [dispatch, id]);

  const openConversation = () => {
    dispatch(getConversationUserId(info?.id));
    dispatch(setCloseProfile());
    dispatch(showContactInfo());
  };

  return (
    <Flex vertical>
      <Image
        height={180}
        src="https://res.cloudinary.com/dw3oj3iju/image/upload/v1709748276/chat_app/t0aytyt93yhgj5yb3fce.jpg"
        preview={{ mask: false }}
        className="cursor-pointer"
      />
      <Space
        direction="vertical"
        style={{
          paddingLeft: '14px',
          paddingBottom: '20px',
          borderBottom: '8px solid #edebeb'
        }}
        className="px-3 pb-5 border-b-2 border-t-0 border-x-0 border-solid border-gray-200"
      >
        <Flex justify="space-between" align="center">
          <Space>
            <Avatar
              style={{
                marginTop: '-40px',
                borderStyle: 'solid',
                borderWidth: '2px',
                borderColor: 'white'
              }}
              draggable={true}
              alt="Avatar"
              size={90}
              src={info?.avatar}
            />
            <Title level={5} className="mt-2" strong>
              {info?.full_name}
            </Title>
          </Space>
          <Space>
            <Tooltip placement="bottomRight" title="Send message">
              <Button
                type="primary"
                icon={<LuMessagesSquare />}
                shape="circle"
                onClick={openConversation}
              />
            </Tooltip>
            {!info?.is_friend && !info?.friend_request ? (
              <Tooltip placement="bottomRight" title="Add friends">
                <Button
                  type="primary"
                  icon={<LuUserPlus />}
                  shape="circle"
                  onClick={changeView}
                />
              </Tooltip>
            ) : info?.friend_request?.sender == currentUserId ? (
              <Tooltip placement="bottomRight" title="Undo request">
                <Button
                  type="primary"
                  icon={<IoArrowUndoSharp />}
                  shape="circle"
                  onClick={() =>
                    dispatch(deleteFriendRequest(info?.friend_request?.id))
                  }
                />
              </Tooltip>
            ) : null}
          </Space>
        </Flex>
        {info?.friend_request?.receiver == currentUserId && (
          <>
            <div className="p-2 bg-gray-50 my-2 rounded border-[1px] border-gray-200 border-solid">
              <p className="m-0 line-clamp-2 text-ellipsis overflow-hidden">
                {info?.friend_request?.message}
              </p>
            </div>
            <Flex align="center" justify="space-between">
              <Button
                type="text"
                className="bg-neutral-200 w-[48%]"
                onClick={() =>
                  dispatch(deleteFriendRequest(info?.friend_request?.id))
                }
              >
                Reject
              </Button>
              <Button
                type="primary"
                className="w-[48%]"
                onClick={() =>
                  dispatch(acceptFriendRequest(info?.friend_request?.id))
                }
              >
                Accept
              </Button>
            </Flex>
          </>
        )}
      </Space>

      <Space className="px-5 py-4" direction="vertical">
        <Title level={5} strong>
          Personal information
        </Title>
        {info?.about && <ItemInfo label="Bio" value={info?.about} />}
        {info?.email && <ItemInfo label="Email" value={info?.email} />}
        {info?.birthday && <ItemInfo label="Birthday" value={info?.birthday} />}
        {info?.phone && <ItemInfo label="Phone" value={info?.phone} />}
      </Space>
    </Flex>
  );
};

const ItemInfo = ({ label, value }) => {
  return (
    <Space align="start">
      <span className="block w-[100px] text-sm">{label}</span>
      <Text>{value}</Text>
    </Space>
  );
};

export default ProfileInfo;
