import { Flex, Space } from 'antd';
import { ContactItem } from './ContactItem';
import { useEffect } from 'react';
import { useDispatch, useSelector } from '~/store';
import { getConversations, setCurrentPage } from '~/store/slices/chatSlice';
import ContactItemSkeleton from '~/section/chats/conversations/ContactItemSkeleton';
import ContactsHeaderFind from '~/section/chats/conversations/ContactsHeaderFind';
import ContactsHeader from '~/section/chats/conversations/ContactsHeader';
import InfiniteScroll from 'react-infinite-scroll-component';

export const Contacts = ({ ...props }) => {
  const dispatch = useDispatch();
  const { openSearch } = useSelector((state) => state.contact);
  const { conversations, currentPage, lastPage, isLoading, chat } = useSelector(
    (state) => state.chat
  );
  const { user } = useSelector((state) => state.auth);
  const conversationsList = [...conversations];
  useEffect(() => {
    if (conversationsList.length == 0)
      dispatch(getConversations({ page: currentPage }));
  }, [dispatch, currentPage, conversationsList.length]);

  async function fetchMoreData() {
    await dispatch(getConversations({ page: currentPage + 1 }));
    dispatch(setCurrentPage(currentPage + 1));
  }

  return (
    <Flex className="h-screen" vertical {...props}>
      {!openSearch ? (
        <>
          <ContactsHeader />
          <div
            className="overflow-auto custom-scrollbar"
            style={{
              height: 'calc(100vh)',
              boxShadow:
                '0px 1px 1px -1px rgba(0,0,0,.1), 0px -1px 1px -1px rgba(0,0,0,.1)',
              display: 'flex',
              flexDirection: 'column'
            }}
            id="scollable"
          >
            <InfiniteScroll
              dataLength={conversationsList.length}
              next={fetchMoreData}
              className="flex flex-col overflow-y-auto"
              hasMore={currentPage < lastPage}
              loader={<ContactItemSkeleton />}
              scrollableTarget="scollable"
            >
              <Space direction="vertical" size={0}>
                {!isLoading
                  ? conversationsList
                      .sort((a, b) => {
                        const isPinnedA = a.is_pinned ? 1 : -1;
                        const isPinnedB = b.is_pinned ? 1 : -1;

                        if (!a.is_pinned && !b.is_pinned) {
                          const createdA = new Date(
                            a.latest_message.created_at
                          ).getTime();
                          const createdB = new Date(
                            b.latest_message.created_at
                          ).getTime();
                          return createdB - createdA;
                        }

                        return isPinnedB - isPinnedA;
                      })
                      .map((conversation) => {
                        const us = conversation?.members.filter(
                          (member) => member.id != user.id
                        )[0];
                        return (
                          <ContactItem
                            key={conversation.id}
                            id={conversation.id}
                            title={
                              conversation.type == 1
                                ? conversation.title
                                : `${us.first_name} ${us.last_name}`
                            }
                            image={
                              conversation.type == 1
                                ? conversation.image
                                : us.avatar
                            }
                            lastestMessage={conversation.latest_message}
                            type={conversation.type}
                            members={conversation.members}
                            active={
                              conversation.id == chat.currentConversation.id
                            }
                            is_pinned={conversation.is_pinned}
                            admin={conversation.admin}
                          />
                        );
                      })
                  : Array.from({
                      length: 10
                    }).map((_, i) => {
                      return <ContactItemSkeleton key={i} />;
                    })}
              </Space>
            </InfiniteScroll>
          </div>
        </>
      ) : (
        <>
          <ContactsHeaderFind />
        </>
      )}
    </Flex>
  );
};
