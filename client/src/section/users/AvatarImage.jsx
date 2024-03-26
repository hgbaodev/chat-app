import { Avatar } from 'antd';
import { useSelector } from 'react-redux';
import AvatarGroup from '~/components/AvatarGroup';
import { ConversationTypes } from '~/utils/enum';

const AvatarImage = ({ size = null, sizeGroup = null }) => {
  const { user } = useSelector((state) => state.auth);
  const { currentConversation } = useSelector((state) => state.chat.chat);
  if (currentConversation.type == ConversationTypes.FRIEND) {
    return (
      <Avatar
        src={
          currentConversation.members.find((member) => member.id != user.id)[
            'avatar'
          ]
        }
        size={size != null ? size : 'large'}
      />
    );
  } else if (currentConversation.type == ConversationTypes.GROUP) {
    if (currentConversation.image != null) {
      return (
        <Avatar
          src={currentConversation.image}
          size={size != null ? size : 'large'}
        />
      );
    }
    return (
      <AvatarGroup
        sizeGroup={sizeGroup}
        users={currentConversation.members.filter(
          (member) => member != user.id
        )}
      />
    );
  }
};

export default AvatarImage;
