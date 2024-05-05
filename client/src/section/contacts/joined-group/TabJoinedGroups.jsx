import { Empty, Flex, Input, Select, Space, Spin } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { IoPeopleOutline, IoSearchOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { LoadingOutlined } from '@ant-design/icons';
import { useSelector } from '~/store';
import { getAllGroup } from '~/store/slices/relationshipSlice';
import { GroupItem } from '~/section/contacts/joined-group/GroupItem';

const TabJoinedGroups = () => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [filter, setFilter] = useState('all');
  const { user } = useSelector((state) => state.auth);

  const { isLoading, data } = useSelector((state) => state.relationship.groups);

  const handleSortChange = (selectedOption) => {
    setSort(selectedOption);
  };

  const handleFilterChange = (selectedOption) => {
    setFilter(selectedOption);
  };

  // effect
  useEffect(() => {
    dispatch(getAllGroup());
  }, [dispatch]);

  const filteredAndSortedGroups = useMemo(() => {
    const filteredGroups = data.filter((group) =>
      group.title.toLowerCase().includes(search.toLowerCase())
    );

    const furtherFilteredGroups = filteredGroups.filter((group) => {
      if (filter === 'admin') {
        return group.admin === user.id;
      } else {
        return true;
      }
    });

    return furtherFilteredGroups.sort((a, b) => {
      if (sort === 'asc') {
        return a.title.localeCompare(b.title);
      } else if (sort === 'desc') {
        return b.title.localeCompare(a.title);
      } else if (sort === 'newest') {
        return (
          new Date(b.latest_message.created_at) -
          new Date(a.latest_message.created_at)
        );
      } else if (sort === 'oldest') {
        return (
          new Date(a.latest_message.created_at) -
          new Date(b.latest_message.created_at)
        );
      }
      return 0;
    });
  }, [data, search, filter, user.id, sort]);

  return (
    <>
      <Flex
        align="center"
        gap={10}
        className="h-[60px] p-4"
        style={{ boxShadow: '0px 0px 2px rgba(0,0,0,.2)' }}
      >
        <IoPeopleOutline size={22} />
        <p className="font-semibold">
          Joined Groups ({filteredAndSortedGroups.length})
        </p>
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
              { value: 'desc', label: 'Name (Z-A)' },
              { value: 'newest', label: 'Last updated (newest - oldest)' },
              { value: 'oldest', label: 'Last updated (oldest - newest)' }
            ]}
            onChange={handleSortChange}
          />
          <Select
            className="w-[250px]"
            defaultValue="all"
            options={[
              { value: 'all', label: 'All' },
              { value: 'admin', label: 'My admin groups' }
            ]}
            onChange={handleFilterChange}
          />
        </Flex>
        {isLoading ? (
          <Flex align="center" justify="center">
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />}
            />
          </Flex>
        ) : (
          <div>
            {filteredAndSortedGroups.length ? (
              filteredAndSortedGroups.map((group) => (
                <GroupItem key={group.id} group={group} />
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

export default TabJoinedGroups;
