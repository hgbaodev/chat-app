import { Avatar, Button, Empty, Flex, Input, Modal, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { IoChevronBack } from 'react-icons/io5';
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
import CustomLoader from '~/components/CustomLoader';

const AddFriendsModal = ({ isModalOpen, setIsModalOpen }) => {
  const dispatch = useDispatch();
  const { fullName } = useSelector((state) => state.auth.user);
  const { isLoading } = useSelector((state) => state.relationship);
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
            <Flex align="center" gap={8}>
              <Button
                type="text"
                shape="circle"
                size="small"
                icon={<IoChevronBack size={18} />}
                onClick={handleResetSelectedUser}
              />
              Add friend
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
          <Space direction="vertical" className="w-[100%] mt-3" size="middle">
            <Space gap={12}>
              <Avatar size="large" src={userSelected.avatar} />
              <Space direction="vertical" size={0}>
                <p className="m-0">{userSelected.full_name}</p>
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
              <Button
                loading={isLoading}
                type="primary"
                onClick={handleAddFriend}
              >
                Add friend
              </Button>
            </Flex>
          </Space>
        ) : (
          <Space direction="vertical" className="w-[100%]" size="middle">
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
            <div className="h-[380px] overflow-y-auto scrollbar">
              {isLoading ? (
                <CustomLoader />
              ) : users.length ? (
                users.map((user) => (
                  <UserSearchItem
                    key={user.id}
                    avatar={user.avatar}
                    fullName={user.full_name}
                    email={user.email}
                    status={user.relationship}
                    handleSelected={() => {
                      handleSelectUser(user.id);
                    }}
                  />
                ))
              ) : (
                <Empty description="Friends is empty" className="py-4" />
              )}
            </div>
          </Space>
        )}
      </Modal>
    </>
  );
};

export default AddFriendsModal;
