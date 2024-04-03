import { Button, Flex, Input } from 'antd';
import { useState } from 'react';
import { CiSearch } from 'react-icons/ci';
import { LuUserPlus, LuUsers } from 'react-icons/lu';
import { useDispatch } from 'react-redux';
import AddFriendsModal from '~/section/common/AddFriendsModal';
import NewGroupModel from '~/section/common/NewGroupModal';
import { setOpenSearch } from '~/store/slices/contactSlice';

const ContactsHeader = () => {
  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);
  const [isNewGroupModalOpen, setIsNewGroupModalOpen] = useState(false);
  const dispatch = useDispatch();

  const handleSearch = () => {
    dispatch(setOpenSearch(true));
  };

  return (
    <>
      <Flex className="w-[100%] p-4" justify="space-between" gap="small">
        <Input
          variant="filled"
          placeholder="Search here..."
          prefix={<CiSearch />}
          onFocus={handleSearch}
          className="w-auto flex-1"
        />
        <Button
          type="text"
          icon={<LuUserPlus size={20} />}
          onClick={() => setIsAddFriendModalOpen(true)}
        />
        <Button
          type="text"
          icon={<LuUsers size={20} />}
          onClick={() => setIsNewGroupModalOpen(true)}
        />
      </Flex>
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

export default ContactsHeader;
