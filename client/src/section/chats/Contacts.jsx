/* eslint-disable indent */
import { Flex, Space } from 'antd';
import { ContactItem } from './ContactItem';
import { useEffect } from 'react';
import { useDispatch, useSelector } from '~/store';
import { getConversations } from '~/store/slices/chatSlice';
import ContactItemSkeleton from '~/section/chats/ContactItemSkeleton';
import ContactsHeaderFind from '~/section/chats/ContactsHeaderFind';
import ContactsHeader from '~/section/chats/ContactsHeader';

export const Contacts = ({ ...props }) => {
  const dispatch = useDispatch();
  const { openSearch } = useSelector((state) => state.contact);
  const { conversations, isLoading, chat } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  const conversationsList = [...conversations];
  useEffect(() => {
    dispatch(getConversations());
  }, [dispatch]);

  return (
    <Flex className="h-screen" vertical {...props}>
      {!openSearch ? (
        <>
          <ContactsHeader />
          <Space
            direction="vertical"
            className="overflow-y-auto scrollbar gap-0"
          >
            {!isLoading
              ? conversationsList
                  .sort((a, b) => {
                    const createdA = new Date(
                      a.latest_message.created_at
                    ).getTime();
                    const createdB = new Date(
                      b.latest_message.created_at
                    ).getTime();
                    return createdB - createdA;
                  })
                  .map((conversation) => {
                    const us = conversation?.members.filter((member) => member.id != user.id)[0]
                    return (
                      <ContactItem
                        key={conversation.id}
                        id={conversation.id}
                        title={conversation.type == 1 ? conversation.title : `${us.first_name} ${us.last_name}`}
                        image={conversation.type == 1 ? conversation.image : us.avatar}
                        lastestMessage={conversation.latest_message}
                        active={conversation.id == chat.currentConversation.id}
                      />
                    );
                  })
              : Array.from({
                  length: 10
                }).map((_, i) => {
                  return <ContactItemSkeleton key={i} />;
                })}
          </Space>
        </>
      ) : (
        <>
          <ContactsHeaderFind />
        </>
      )}
    </Flex>
  );
};
