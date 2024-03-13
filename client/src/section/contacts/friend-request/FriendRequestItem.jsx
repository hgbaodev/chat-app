import { Avatar, Button, Col, Flex } from 'antd';
import { IoChatbubblesOutline } from 'react-icons/io5';
import useCustomMessage from '~/hooks/useCustomMessage';
import { formatTimeAgo } from '~/utils/formatTimeAgo';
import { useDispatch } from '~/store';
import {
  acceptFriendRequest,
  deleteFriendRequest
} from '~/store/slices/relationshipSlice';

const FriendRequestItem = ({
  id,
  avatar,
  fullName,
  invitationMessage,
  time,
  isSended = true
}) => {
  const dispatch = useDispatch();
  const { success, error } = useCustomMessage();
  // handle

  const handleDeleteFriendRequest = async () => {
    const response = await dispatch(deleteFriendRequest(id));
    if (response.payload.data.msg) success(response.payload.data.msg);
    else error('Some went wrong!');
  };
  const handleAcceptFriendRequest = async () => {
    const response = await dispatch(acceptFriendRequest(id));
    if (response.payload.data.msg) success(response.payload.data.msg);
    else error('Some went wrong!');
  };

  return (
    <Col sm={12} md={8} lg={8} xl={8}>
      <div className="bg-white p-4 rounded-md">
        <Flex align="center" justify="space-between">
          <Flex align="center" gap={10}>
            <Avatar size={40} src={avatar} />
            <div>
              <p className="my-1 font-semibold">{fullName}</p>
              <p className="m-0 text-[12px]">{formatTimeAgo(time)}</p>
            </div>
          </Flex>
          <Button
            type="text"
            shape="circle"
            icon={<IoChatbubblesOutline size={20} />}
          />
        </Flex>
        <div className="h-[60px] p-2  bg-gray-50 my-4 rounded border-[1px] border-gray-200 border-solid">
          <p className="m-0 line-clamp-2 text-ellipsis overflow-hidden">
            {invitationMessage}
          </p>
        </div>
        <Flex align="center" justify="space-between">
          <Button
            type="text"
            className={` bg-neutral-200 ${isSended ? 'w-[100%]' : 'w-[48%]'}`}
            onClick={handleDeleteFriendRequest}
          >
            Reject
          </Button>
          {!isSended && (
            <Button
              type="primary"
              className="w-[48%]"
              onClick={handleAcceptFriendRequest}
            >
              Accept
            </Button>
          )}
        </Flex>
      </div>
    </Col>
  );
};

export default FriendRequestItem;
