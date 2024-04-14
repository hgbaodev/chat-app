import { Avatar, Flex, Image, Space, Typography, Button } from 'antd';
import { useEffect, useState } from 'react';
import { IoArrowUndoSharp, IoChevronBack } from 'react-icons/io5';
import { LuMessagesSquare, LuUserPlus } from 'react-icons/lu';
import ModalComponent from '~/components/ModalComponent';
import SendFriendRequest from '~/section/common/SendFriendRequest';
import { useDispatch, useSelector } from '~/store';
import {
  acceptFriendRequest,
  deleteFriendRequest,
  getProfile,
  setOpenProfile
} from '~/store/slices/relationshipSlice';
const { Text, Title } = Typography;

const ProfileModal = () => {
  const { info, id } = useSelector((state) => state.relationship.profile);
  const currentUserId = useSelector((state) => state.auth.user.id);
  const dispatch = useDispatch();
  const [openFriendRequest, setOpenFriendRequest] = useState(false);

  useEffect(() => {
    if (id) dispatch(getProfile(id));
  }, [dispatch, id]);

  const handleClose = () => {
    dispatch(setOpenProfile(''));
  };

  const handleCloseFriendRequest = () => {
    setOpenFriendRequest(false);
  };

  return (
    <ModalComponent
      open={id}
      title={
        openFriendRequest ? (
          <Flex align="center" gap={8}>
            <Button
              type="text"
              shape="circle"
              size="small"
              icon={<IoChevronBack size={18} />}
              onClick={handleCloseFriendRequest}
            />
            Add friend
          </Flex>
        ) : (
          'Profile'
        )
      }
      onCancel={handleClose}
      footer={null}
      width={400}
      centered
    >
      {openFriendRequest ? (
        <SendFriendRequest
          user={info}
          handleCancel={handleCloseFriendRequest}
          fnCallBack={handleCloseFriendRequest}
          className="p-6 pt-0"
        />
      ) : (
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

              {info?.is_friend ? (
                <Button
                  type="primary"
                  icon={<LuMessagesSquare />}
                  shape="circle"
                />
              ) : !info?.friend_request ? (
                <Button
                  type="primary"
                  icon={<LuUserPlus />}
                  shape="circle"
                  onClick={() => setOpenFriendRequest(true)}
                />
              ) : info?.friend_request?.sender == currentUserId ? (
                <Button
                  type="default"
                  shape="round"
                  icon={<IoArrowUndoSharp />}
                  onClick={() =>
                    dispatch(deleteFriendRequest(info?.friend_request?.id))
                  }
                >
                  Undo request
                </Button>
              ) : null}
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
            {info?.birthday && (
              <ItemInfo label="Birthday" value={info?.birthday} />
            )}
            {info?.phone && <ItemInfo label="Phone" value={info?.phone} />}
          </Space>
        </Flex>
      )}
    </ModalComponent>
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

export default ProfileModal;
