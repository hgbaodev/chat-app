import { useState } from 'react';
import ModalComponent from '~/components/ModalComponent';
import ModalTitle from '~/components/ModalTitle';
import ProfileInfo from '~/section/common/ProfileInfo';
import SendFriendRequest from '~/section/common/SendFriendRequest';
import { useDispatch, useSelector } from '~/store';
import { setCloseProfile } from '~/store/slices/relationshipSlice';

const ProfileModal = () => {
  const [openFriendRequest, setOpenFriendRequest] = useState(false);

  const { open } = useSelector((state) => state.relationship.profile);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(setCloseProfile());
  };

  const handleCloseFriendRequest = () => {
    setOpenFriendRequest(false);
  };

  return (
    <ModalComponent
      open={open}
      title={
        openFriendRequest ? (
          <ModalTitle title="Add friend" onClick={handleCloseFriendRequest} />
        ) : (
          'Profile'
        )
      }
      onCancel={handleClose}
      footer={null}
      width={400}
      centered
    >
      {openFriendRequest ? (
        <SendFriendRequest
          handleCancel={handleCloseFriendRequest}
          className="p-6 pt-0"
        />
      ) : (
        <ProfileInfo changeView={() => setOpenFriendRequest(true)} />
      )}
    </ModalComponent>
  );
};

export default ProfileModal;
