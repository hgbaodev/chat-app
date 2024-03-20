import { Button, Flex, Input, Space, Typography } from 'antd';
import { CiSearch } from 'react-icons/ci';
import { useDispatch } from 'react-redux';
import { findConversations, setOpenSearch } from '~/store/slices/contactSlice';
import { ContactItemSearch } from '~/section/chats/ContactItemSearch';
import { useEffect, useState } from 'react';
import useDebounce from '~/hooks/useDebounce';
import { useSelector } from '~/store';
import ContactItemSkeleton from '~/section/chats/ContactItemSkeleton';
import { GroupTypes } from '~/utils/enum';

const ContactsHeaderFind = () => {
  const { searchConversation, isLoading } = useSelector(
    (state) => state.contact
  );

  const { chat } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const [query, setQuery] = useState('');
  const debouceQuery = useDebounce(query, 500);

  useEffect(() => {
    const fetch = () => {
      dispatch(findConversations(debouceQuery));
    };
    fetch();
  }, [debouceQuery, dispatch]);

  const handleExitSearch = () => {
    dispatch(setOpenSearch(false));
  };
  const renderConversationsByType = (type) => {
    return searchConversation
      .filter((conversation) => conversation.type === type)
      .map((conversation) => {
        const us = conversation?.members.find(
          (member) => member.id !== user.id
        );
        return (
          <ContactItemSearch
            key={conversation.id}
            id={conversation.id}
            title={
              conversation.type === 1
                ? conversation.title
                : `${us?.first_name} ${us?.last_name}`
            }
            image={conversation.type === 1 ? conversation.image : us?.avatar}
            members={conversation.members}
            type={conversation.type}
            active={conversation.id === chat.currentConversation.id}
          />
        );
      });
  };
  return (
    <>
      <Flex vertical className='overflow-y-auto'>
        <Space className="w-[100%] p-4">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            variant="filled"
            placeholder="Search here..."
            prefix={<CiSearch />}
            autoFocus
          />
          <Button type="text" onClick={handleExitSearch}>
            Close
          </Button>
        </Space>
        {!isLoading ? (
          <>
            <Flex vertical>
              {searchConversation.some(
                (conversation) => conversation.type === GroupTypes.FRIEND
              ) && (
                <Typography.Text strong className="px-4 mb-2">
                  Friends
                </Typography.Text>
              )}
              {renderConversationsByType(GroupTypes.FRIEND)}
              {searchConversation.some(
                (conversation) => conversation.type === GroupTypes.GROUP
              ) && (
                <Typography.Text strong className="px-4 mb-2">
                  Groups
                </Typography.Text>
              )}
              {renderConversationsByType(GroupTypes.GROUP)}
            </Flex>
          </>
        ) : (
          Array.from({ length: 10 }).map((_, i) => (
            <ContactItemSkeleton key={i} />
          ))
        )}
      </Flex>
    </>
  );
};

export default ContactsHeaderFind;
