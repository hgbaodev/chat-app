import { Avatar, Badge } from 'antd';
import { useSelector } from 'react-redux';
import AvatarGroup from '~/components/AvatarGroup';
import { ConversationTypes } from '~/utils/enum';

const AvatarImage = ({ size = null, sizeGroup = null }) => {
  const { user } = useSelector((state) => state.auth);
  const { currentConversation } = useSelector((state) => state.chat.chat);
  if (currentConversation.type == ConversationTypes.FRIEND) {
    return (
      <Badge
        size="default"
        dot={
          currentConversation.members.find((member) => member.id != user.id)[
            'status'
          ]
        }
        color="green"
        offset={size != null ? [-3, 49] : [0, 30]}
      >
        <Avatar
          src={
            currentConversation.members.find((member) => member.id != user.id)[
              'avatar'
            ]
          }
          size={size != null ? size : 'large'}
        />
      </Badge>
    );
  } else if (currentConversation.type == ConversationTypes.GROUP) {
    if (currentConversation.image != null) {
      return (
        <Badge
          size="default"
          dot={currentConversation.members
            .filter((member) => member.id != user.id)
            .some((mem) => mem['status'] === true)}
          color="green"
          offset={[0, 30]}
        >
          <Avatar
            src={currentConversation.image}
            size={size != null ? size : 'large'}
          />
        </Badge>
      );
    }
    return (
      <Badge
        size="default"
        dot={currentConversation.members
          .filter((member) => member.id != user.id)
          .some((mem) => mem['status'] === true)}
        color="green"
        offset={[0, 42]}
      >
        <AvatarGroup
          sizeGroup={sizeGroup}
          users={currentConversation.members.filter(
            (member) => member != user.id
          )}
        />
      </Badge>
    );
  }
};

export default AvatarImage;
