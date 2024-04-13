import { Button, Empty, Flex, Input, Modal, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { IoChevronBack } from 'react-icons/io5';
import { useDispatch, useSelector } from '~/store';
import {
  getRecommendedUsers,
  searchUsers
} from '~/store/slices/relationshipSlice';
import useDebounce from '~/hooks/useDebounce';
import UserSearchItem from '~/section/common/UserSearchItem';
import CustomLoader from '~/components/CustomLoader';
import SendFriendRequest from '~/section/common/SendFriendRequest';

const AddFriendsModal = ({ isModalOpen, setIsModalOpen }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.relationship);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const debouncedSearchText = useDebounce(search, 500);
  const [userSelected, setUserSelected] = useState(null);

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
  };

  const handleResetSelectedUser = () => {
    setUserSelected(null);
  };

  const fnCallBackSuccess = () => {
    users.map((user) => {
      if (user.id == userSelected.id) {
        user.relationship = 1;
      }
    });
    setUserSelected(null);
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
          <SendFriendRequest
            user={userSelected}
            handleCancel={handleResetSelectedUser}
            fnCallBack={fnCallBackSuccess}
          />
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
