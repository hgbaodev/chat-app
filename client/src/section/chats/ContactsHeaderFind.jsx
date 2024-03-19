import { Button, Flex, Input, Space } from 'antd';
import { CiSearch } from 'react-icons/ci';
import { useDispatch } from 'react-redux';
import { findConversations, setOpenSearch } from '~/store/slices/contactSlice';
import { ContactItemSearch } from '~/section/chats/ContactItemSearch';
import { useEffect, useState } from 'react';
import useDebounce from '~/hooks/useDebounce';
import { useSelector } from '~/store';
import ContactItemSkeleton from '~/section/chats/ContactItemSkeleton';

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
  return (
    <>
      <Flex vertical>
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
        {!isLoading
             ? searchConversation.map((conversation) => {
                    const us = conversation?.members.filter((member) => member.id != user.id)[0]
                    return (
                      <ContactItemSearch
                        key={conversation.id}
                        id={conversation.id}
                        title={conversation.type == 1 ? conversation.title : `${us.first_name} ${us.last_name}`}
                        image={conversation.type == 1 ? conversation.image : us.avatar}
                        members={conversation.members}
                        type={conversation.type}
                        active={conversation.id == chat.currentConversation.id}
                      />
                    );
                  })
              : Array.from({
                  length: 10
                }).map((_, i) => {
                  return <ContactItemSkeleton key={i} />;
                })}
      </Flex>
    </>
  );
};

export default ContactsHeaderFind;
