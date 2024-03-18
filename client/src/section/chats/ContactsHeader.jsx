import { Button, Input, Space } from "antd";
import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { MdOutlineGroupAdd, MdOutlinePersonAddAlt } from "react-icons/md";
import { useDispatch } from "react-redux";
import AddFriendsModal from "~/section/common/AddFriendsModal";
import NewGroupModel from "~/section/common/NewGroupModal";
import { setOpenSearch } from "~/store/slices/contactSlice";

const ContactsHeader = () => {
  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);
  const [isNewGroupModalOpen, setIsNewGroupModalOpen] = useState(false);
  const dispatch = useDispatch()

  const handleSearch = () => {
    dispatch(setOpenSearch((true)))
  }

  return (
    <>
      <Space className="w-[100%] p-4">
        <Input
          variant="filled"
          placeholder="Search here..."
          prefix={<CiSearch />}
          onFocus={handleSearch}
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

export default ContactsHeader;