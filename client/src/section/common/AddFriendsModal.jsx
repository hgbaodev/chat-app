import { useState, useCallback } from 'react';
import SendFriendRequest from '~/section/common/SendFriendRequest';
import ModalTitle from '~/components/ModalTitle';
import FriendSuggestions from '~/section/common/FriendSuggestions';
import ProfileInfo from '~/section/common/ProfileInfo';
import ModalComponent from '~/components/ModalComponent';
import { useDispatch, useSelector } from '~/store';
import { setOpenFriendRequest } from '~/store/slices/relationshipSlice';

const AddFriendsModal = () => {
  const [viewType, setViewType] = useState('suggestions');
  const dispatch = useDispatch();
  const { isOpenFriendRequest } = useSelector((state) => state.relationship);

  const handleClose = () => {
    setViewType('suggestions');
    dispatch(setOpenFriendRequest(false));
  };

  const modalTitle = useCallback(() => {
    if (viewType === 'suggestions') {
      return 'Add friend';
    }
    if (viewType === 'profile') {
      return (
        <ModalTitle
          title="Profile"
          onClick={() => setViewType('suggestions')}
        />
      );
    }
    if (viewType === 'request') {
      return (
        <ModalTitle title="Add friend" onClick={() => setViewType('profile')} />
      );
    }
  }, [viewType]);

  const modalContent = useCallback(() => {
    if (viewType === 'suggestions') {
      return (
        <FriendSuggestions setViewType={setViewType} className="p-5 pt-0" />
      );
    }
    if (viewType === 'profile') {
      return <ProfileInfo changeView={() => setViewType('request')} />;
    }
    if (viewType === 'request') {
      return (
        <SendFriendRequest
          handleCancel={() => setViewType('profile')}
          className="p-6 pt-0"
        />
      );
    }
  }, [viewType]);

  return (
    <ModalComponent
      title={modalTitle()}
      open={isOpenFriendRequest}
      onCancel={handleClose}
      width={400}
      footer={null}
    >
      {modalContent()}
    </ModalComponent>
  );
};

export default AddFriendsModal;
