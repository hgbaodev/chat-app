import { Empty, Input, Space } from 'antd';
import CustomLoader from '~/components/CustomLoader';
import UserSearchItem from '~/section/common/UserSearchItem';
import { SearchOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from '~/store';
import { useEffect, useState } from 'react';
import useDebounce from '~/hooks/useDebounce';
import {
  getRecommendedUsers,
  searchUsers
} from '~/store/slices/relationshipSlice';

const FriendSuggestions = ({ setViewType, className }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.relationship);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const debouncedSearchText = useDebounce(search, 500);

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

  return (
    <Space
      direction="vertical"
      className={`w-[100%] ${className}`}
      size="middle"
    >
      <Input
        name="input-search"
        placeholder="Enter email or phone"
        variant="filled"
        prefix={<SearchOutlined />}
        className="mt-2"
        autoComplete="nope"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
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
              id={user.id}
              avatar={user.avatar}
              fullName={user.full_name}
              email={user.email}
              status={user.relationship}
              setViewType={setViewType}
            />
          ))
        ) : (
          <Empty description="Friends is empty" className="py-4" />
        )}
      </div>
    </Space>
  );
};

export default FriendSuggestions;
