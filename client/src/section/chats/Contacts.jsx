/* eslint-disable indent */
import { Button, Flex, Input, Space, Typography } from 'antd';
import { ContactItem } from './ContactItem';
import { SearchOutlined } from '@ant-design/icons';
import { MdOutlineGroupAdd, MdOutlinePersonAddAlt } from 'react-icons/md';
import { useEffect, useState } from 'react';
import AddFriendsModal from '~/section/common/AddFriendsModal';
import NewGroupModel from '../common/NewGroupModal';
import { useDispatch, useSelector } from '~/store';
import { getConversations } from '~/store/slices/chatSlice';
import ContactItemSkeleton from '~/section/chats/ContactItemSkeleton';

export const Contacts = ({ ...props }) => {
  const dispatch = useDispatch();
  const [find, setFind] = useState(false);
  const { conversations, isLoading, chat } = useSelector((state) => state.chat);
  const conversationsList = [...conversations];
  useEffect(() => {
    dispatch(getConversations());
  }, [dispatch]);

  return (
    <Flex className="h-screen" vertical {...props}>
      {!find ? (
        <>
          <ContactsHeader setFind={setFind} />
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
                  .map((conversation) => (
                    <ContactItem
                      key={conversation.id}
                      id={conversation.id}
                      title={conversation.title}
                      image={conversation.image}
                      lastestMessage={conversation.latest_message}
                      active={conversation.id == chat.currentConversation.id}
                    />
                  ))
              : Array.from({
                  length: 10
                }).map((_, i) => {
                  return <ContactItemSkeleton key={i} />;
                })}
          </Space>
        </>
      ) : (
        <>
          <ContactsHeaderFind setFind={setFind} />
        </>
      )}
    </Flex>
  );
};

const ContactsHeader = ({ setFind }) => {
  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);
  const [isNewGroupModalOpen, setIsNewGroupModalOpen] = useState(false);

  return (
    <>
      <Space className="w-[100%] p-4">
        <Input
          variant="filled"
          placeholder="Search here..."
          prefix={<SearchOutlined />}
          onClick={() => setFind(true)}
        />
        <Button
          type="text"
          icon={<MdOutlinePersonAddAlt size={20} />}
          onClick={() => setIsAddFriendModalOpen(true)}
        />
        <Button
          type="text"
          icon={<MdOutlineGroupAdd size={20} />}
          onClick={() => setIsNewGroupModalOpen(true)}
        />
      </Space>
      {isAddFriendModalOpen && (
        <AddFriendsModal
          isModalOpen={isAddFriendModalOpen}
          setIsModalOpen={setIsAddFriendModalOpen}
        />
      )}
      {isNewGroupModalOpen && (
        <NewGroupModel
          isModalOpen={isNewGroupModalOpen}
          setIsModalOpen={setIsNewGroupModalOpen}
        />
      )}
    </>
  );
};

const ContactsHeaderFind = ({ setFind }) => {
  return (
    <>
      <Flex vertical className="w-[100%] p-4">
        <Space>
          <Input
            variant="filled"
            placeholder="Search here..."
            prefix={<SearchOutlined />}
            autoFocus
          />
          <Button type="text" onClick={() => setFind(false)}>
            Close
          </Button>
        </Space>
        <Space direction="vertical" className='py-4'>
          <Typography.Text strong>Friends</Typography.Text>
        </Space>
        <Space direction="vertical" className='py-4'>
          <Typography.Text strong>Groups</Typography.Text>
        </Space>
      </Flex>
    </>
  );
};
