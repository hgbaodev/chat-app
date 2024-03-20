import { Empty, Flex, Input, Select, Space, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import { LoadingOutlined } from '@ant-design/icons';
import { FriendItem } from '~/section/contacts/friends-list/FriendItem';
import { useDispatch, useSelector } from '~/store';
import { getAllFriends } from '~/store/slices/relationshipSlice';
import useDebounce from '~/hooks/useDebounce';

const TabFriendsList = () => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('asc');
  const handleSortChange = (selectedOption) => {
    setSort(selectedOption);
  };
  const searchDebauce = useDebounce(search, 500);
  const { friends, isLoadingGetAll } = useSelector(
    (state) => state.relationship
  );

  // effect
  useEffect(() => {
    dispatch(getAllFriends({ query: searchDebauce, sort: sort }));
  }, [dispatch, searchDebauce, sort]);

  // render
  return (
    <>
      <Flex
        align="center"
        className="h-[60px] p-4"
        style={{ boxShadow: '0px 0px 2px rgba(0,0,0,.1)' }}
      >
        <p className="font-semibold">Friends ({friends.length})</p>
      </Flex>
      <Space
        direction="vertical"
        className="w-[100%] overflow-y-auto h-[calc(100vh-60px)]"
      >
        <Flex className="p-4" gap={10}>
          <Input
            placeholder="Search friends"
            variant="filled"
            prefix={<IoSearchOutline />}
            className="w-[350px]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select
            className="w-[250px]"
            defaultValue={sort}
            options={[
              { value: 'asc', label: 'Name (A-Z)' },
              { value: 'desc', label: 'Name (Z-A)' }
            ]}
            onChange={handleSortChange}
          />
        </Flex>
        {isLoadingGetAll ? (
          <Flex align="center" justify="center">
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />}
            />
          </Flex>
        ) : (
          <div>
            {friends.length ? (
              friends.map((friend) => (
                <FriendItem
                  key={friend.id}
                  id={friend.id}
                  avatar={friend.avatar}
                  fullName={`${friend.first_name} ${friend.last_name}`}
                  email={friend.email}
                />
              ))
            ) : (
              <Empty description="Friends List is empty" className="py-4" />
            )}
          </div>
        )}
      </Space>
    </>
  );
};

export default TabFriendsList;
