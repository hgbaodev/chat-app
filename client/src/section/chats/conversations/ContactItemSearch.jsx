import { Avatar, Button, Dropdown, Flex, Space, Typography, Badge } from 'antd';
import useHover from '~/hooks/useHover';
import { AiOutlineEllipsis } from 'react-icons/ai';
import { useDispatch, useSelector } from '~/store';
import { setCurrentConversation } from '~/store/slices/chatSlice';
import { ConversationTypes } from '~/utils/enum';
import AvatarGroup from '~/components/AvatarGroup';

export const ContactItemSearch = ({
  id,
  title,
  image,
  members,
  type,
  active,
  admin,
  search
}) => {
  const [hoverRef, isHovering] = useHover();
  const dispatch = useDispatch();
  const { currentConversation } = useSelector((state) => state.chat.chat);
  const user = useSelector((state) => state.auth.user);

  const items = [
    {
      key: '1',
      label: <p className="m-0 min-w-[180px]">Pin this conversation</p>
    },
    {
      key: '2',
      label: <p className="m-0 w-[180px]">Mark as unread</p>
    }
  ];

  // handle get all messages
  const getAllMessages = () => {
    if (currentConversation.id != id) {
      dispatch(
        setCurrentConversation({ id, title, image, members, type, admin })
      );
    }
  };

  return (
    <Flex
      ref={hoverRef}
      className={`${
        active ? 'bg-blue-50' : 'bg-white hover:bg-neutral-100'
      } px-4 py-3 cursor-pointer`}
      align="center"
      justify="space-between"
      onClick={getAllMessages}
    >
      <Space className="flex-1">
        <Badge
          size="default"
          dot={members
            .filter((member) => member.id != user.id)
            .some((mem) => mem['status'] === true)}
          color="green"
          offset={[0, 40]}
        >
          {image == null && type === ConversationTypes.GROUP ? (
            <AvatarGroup users={members} />
          ) : (
            <Avatar size={50} src={image} />
          )}
        </Badge>
        <Flex vertical justify="center">
          <Typography
            className="text-gray-700 font-semibold overflow-hidden whitespace-nowrap text-ellipsis max-w-[180px]"
            dangerouslySetInnerHTML={{
              __html:
                search.length === 0
                  ? title
                  : title.replace(new RegExp(search, 'gi'), (match) =>
                      match.toLowerCase() === search.toLowerCase()
                        ? `<span class="text-blue-500">${match}</span>`
                        : match
                    )
            }}
          />
          {search.length != 0 &&
            type === ConversationTypes.GROUP &&
            members.some((member) =>
              (member.first_name + member.last_name)
                .toLowerCase()
                .includes(search.toLowerCase())
            ) && (
              <div
                className="text-gray-500 text-sm overflow-hidden whitespace-nowrap text-ellipsis max-w-[180px]"
                dangerouslySetInnerHTML={{
                  __html:
                    'Members: ' +
                    members
                      .filter(
                        (member) =>
                          (member.first_name + ' ' + member.last_name)
                            .toLowerCase()
                            .includes(search.toLowerCase()) &&
                          member.id != user.id
                      )
                      .map((member) =>
                        (member.first_name + ' ' + member.last_name).replace(
                          new RegExp(search, 'gi'),
                          (match) =>
                            match.toLowerCase() === search.toLowerCase()
                              ? `<span class="text-blue-500">${match}</span>`
                              : match
                        )
                      )
                }}
              />
            )}
        </Flex>
      </Space>
      <Dropdown
        menu={{ items }}
        placement="bottomLeft"
        onClick={(e) => e.stopPropagation()}
        className={`${isHovering ? 'block' : '!hidden'}`}
      >
        <Button
          type="text"
          size="small"
          icon={<AiOutlineEllipsis size={20} />}
        />
      </Dropdown>
    </Flex>
  );
};
