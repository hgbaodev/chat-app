import { Button, Flex, Input, Space } from 'antd';
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
  const { conversations, isLoading, chat } = useSelector((state) => state.chat);

  useEffect(() => {
    dispatch(getConversations());
  }, [dispatch]);

  return (
    <Flex className="h-screen" vertical {...props}>
      <ContactsHeader />
      <Space direction="vertical" className="overflow-y-auto scrollbar gap-0">
        {!isLoading
          ? conversations.map((conversation) => (
              <ContactItem
                key={conversation.id}
                id={conversation.id}
                title={conversation.title}
                image={conversation.image}
                lastestMessage={conversation.latest_message}
                active={conversation.id == chat.currentConversation}
              />
            ))
          : Array.from({
              length: 10
            }).map((_, i) => {
              return <ContactItemSkeleton key={i} />;
            })}
      </Space>
    </Flex>
  );
};

const ContactsHeader = () => {
  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);
  const [isNewGroupModalOpen, setIsNewGroupModalOpen] = useState(false);

  return (
    <>
      <Space className="w-[100%] p-4">
        <Input
          variant="filled"
          placeholder="Search here..."
          prefix={<SearchOutlined />}
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
