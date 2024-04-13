import { Avatar, Button, Flex, Space } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useState } from 'react';
import useCustomMessage from '~/hooks/useCustomMessage';
import { useDispatch, useSelector } from '~/store';
import { sendFriendRequest } from '~/store/slices/relationshipSlice';

const SendFriendRequest = ({
  user,
  handleCancel,
  fnCallBack,
  className = ''
}) => {
  const { id, avatar, full_name, email } = user;
  const dispatch = useDispatch();
  const { success, error } = useCustomMessage();
  const { fullName } = useSelector((state) => state.auth.user);
  const { isLoading } = useSelector((state) => state.relationship);
  const [invitationMessage, setInvitationMessage] = useState(
    `Hello, I'm ${fullName}, Let's be friends!`
  );

  const handleAddFriend = async () => {
    if (invitationMessage) {
      const response = await dispatch(
        sendFriendRequest({
          receiver: id,
          message: invitationMessage
        })
      );
      if (!response.error) {
        success(response.payload.data.msg);
        fnCallBack();
      } else error(response.payload.receiver[0]);
    } else error('Invitation message cannot be empty!');
  };

  return (
    <Space
      direction="vertical"
      className={`w-[100%] mt-3 ${className}`}
      size="middle"
    >
      <Space gap={12}>
        <Avatar size="large" src={avatar} />
        <Space direction="vertical" size={0}>
          <p className="m-0">{full_name}</p>
          <p className="m-0 text-xs text-gray-500">{email}</p>
        </Space>
      </Space>

      <TextArea
        rows={4}
        value={invitationMessage}
        onChange={(e) => {
          setInvitationMessage(e.target.value);
        }}
      />
      <Flex align="center" justify="end" gap={10}>
        <Button type="default" onClick={handleCancel}>
          Cancel
        </Button>
        <Button loading={isLoading} type="primary" onClick={handleAddFriend}>
          Add friend
        </Button>
      </Flex>
    </Space>
  );
};

export default SendFriendRequest;
