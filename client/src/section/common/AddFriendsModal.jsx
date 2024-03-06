import { Avatar, Button, Flex, Input, Modal, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { IoAdd, IoChevronBack } from 'react-icons/io5';
import TextArea from 'antd/es/input/TextArea';
import { useDispatch, useSelector } from '~/store';
import {
  getRecommendedUsers,
  searchUsers,
  sendFriendRequest
} from '~/store/slices/relationshipSlice';
import useDebounce from '~/hooks/useDebounce';
import useCustomMessage from '~/hooks/useCustomMessage';
import UserSearchItem from '~/section/common/UserSearchItem';

const AddFriendsModal = ({ isModalOpen, setIsModalOpen }) => {
  const dispatch = useDispatch();
  const { fullName } = useSelector((state) => state.auth);
  const { success, error } = useCustomMessage();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const debouncedSearchText = useDebounce(search, 500);
  const [userSelected, setUserSelected] = useState(null);
  const [invitationMessage, setInvitationMessage] = useState('');

  useEffect(() => {
    (async () => {
      if (debouncedSearchText) {
        const response = await dispatch(searchUsers(debouncedSearchText));
        setUsers(response.payload.data.users);
      } else {
        const response = await dispatch(getRecommendedUsers());
        setUsers(response.payload.data.users);
      }
    })();
  }, [debouncedSearchText, dispatch]);

  // handle
  const handleClose = () => {
    setUserSelected(null);
    setIsModalOpen(false);
  };

  const handleSelectUser = (user_id) => {
    setUserSelected(users.find((user) => user.id === user_id));
    setInvitationMessage(`Hello, I'm ${fullName}, Let's be friends!`);
  };

  const handleResetSelectedUser = () => {
    setUserSelected(null);
  };

  const handleAddFriend = async () => {
    if (invitationMessage) {
      const response = await dispatch(
        sendFriendRequest({
          receiver: userSelected.id,
          message: invitationMessage
        })
      );
      if (!response.error) {
        success(response.payload.data.msg);
        users.map((user) => {
          if (user.id == userSelected.id) {
            user.relationship = 1;
          }
        });
        setUserSelected(null);
      } else error(response.payload.receiver[0]);
    } else error('Invitation message cannot be empty!');
  };

  const handleSearchUsers = (e) => {
    setSearch(e.target.value);
  };

  // render
  return (
    <>
      <Modal
        title={
          userSelected ? (
            <Flex align="center">
              <Button
                type="text"
                shape="circle"
                icon={<IoChevronBack size={22} />}
                onClick={handleResetSelectedUser}
                style={{ marginRight: 8 }}
              />
              Account Information
            </Flex>
          ) : (
            'Add friend'
          )
        }
        open={isModalOpen}
        onCancel={handleClose}
        width={400}
        footer={null}
      >
        {userSelected ? (
          <Space direction="vertical" className="w-[100%]" size="middle">
            <Space gap={12}>
              <Avatar size="large" src={userSelected.avatar} />
              <Space direction="vertical" size={0}>
                <p className="m-0">{`${userSelected.first_name} ${userSelected.last_name}`}</p>
                <p className="m-0 text-xs text-gray-500">
                  {userSelected.email}
                </p>
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
              <Button type="default" onClick={handleResetSelectedUser}>
                Cancel
              </Button>
              <Button type="primary" onClick={handleAddFriend}>
                Add friend
              </Button>
            </Flex>
          </Space>
        ) : (
          <Space direction="vertical" className="w-[100%]">
            <Input
              name="input-search"
              placeholder="Enter email or phone"
              variant="filled"
              prefix={<SearchOutlined />}
              className="mt-2"
              autoComplete="nope"
              value={search}
              onChange={handleSearchUsers}
            />
            {search ? (
              <p className="text-xs text-gray-500">Recent searches</p>
            ) : (
              <p className="text-xs text-gray-500">Friendship suggestions</p>
            )}
            <div className="max-h-[420px] overflow-y-auto scrollbar">
              {users.map((user) => (
                <UserSearchItem
                  key={user.id}
                  avatar={user.avatar}
                  fullName={`${user.first_name} ${user.last_name}`}
                  email={user.email}
                  status={user.relationship}
                  handleSelected={() => {
                    handleSelectUser(user.id);
                  }}
                />
              ))}
            </div>
          </Space>
        )}
      </Modal>
    </>
  );
};


export default AddFriendsModal;
