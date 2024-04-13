import { Empty, Flex, Row, Space, Typography } from 'antd';
import { useEffect } from 'react';
import { IoPersonAddOutline } from 'react-icons/io5';
import CustomLoader from '~/components/CustomLoader';
import FriendRequestItem from '~/section/contacts/friend-request/FriendRequestItem';
import { useDispatch, useSelector } from '~/store';
import { getAllFriendRequests } from '~/store/slices/relationshipSlice';

const TabFriendsRequest = () => {
  const dispatch = useDispatch();
  const { sent_friend_requests, received_friend_requests, isLoading } =
    useSelector((state) => state.relationship);

  // effect
  useEffect(() => {
    (async () => {
      dispatch(getAllFriendRequests());
    })();
  }, [dispatch]);

  return (
    <div className="w-full  bg-neutral-100">
      <Flex
        align="center"
        gap={10}
        className="h-[60px] p-4 bg-white mb-4"
        style={{ boxShadow: '0px 0px 2px rgba(0,0,0,.1)' }}
      >
        <IoPersonAddOutline size={22} />
        <p className="font-semibold">Friend Requests</p>
      </Flex>
      <Space
        direction="vertical"
        size="middle"
        className="w-full overflow-y-auto h-[calc(100vh-76px)]"
      >
        {isLoading ? (
          <div className="w-full h-[calc(100vh-76px)]">
            <CustomLoader />
          </div>
        ) : (
          <>
            <Space direction="vertical" className="w-full px-5">
              <Typography className="font-semibold">
                Received Requests({received_friend_requests.length})
              </Typography>
              {received_friend_requests.length ? (
                <Row gutter={[16, 16]}>
                  {received_friend_requests.map((item) => (
                    <FriendRequestItem
                      key={item.id}
                      id={item?.id}
                      avatar={item?.sender?.avatar}
                      fullName={item?.sender?.full_name}
                      invitationMessage={item?.message}
                      time={item?.created_at || null}
                      isSended={false}
                    />
                  ))}
                </Row>
              ) : (
                <Empty
                  description="Your incoming request list is empty"
                  className="py-4 "
                />
              )}
            </Space>
            <Space direction="vertical" className="w-[100%] px-5">
              <Typography className="font-semibold">
                Sent Requests ({sent_friend_requests.length})
              </Typography>
              {sent_friend_requests.length ? (
                <Row gutter={[16, 16]}>
                  {sent_friend_requests.map((item) => (
                    <FriendRequestItem
                      key={item?.id}
                      id={item?.id}
                      avatar={item?.receiver?.avatar}
                      fullName={item?.receiver?.full_name}
                      invitationMessage={item?.message}
                      time={item?.created_at}
                    />
                  ))}
                </Row>
              ) : (
                <Empty
                  description="Your sent request list is empty"
                  className="py-4"
                />
              )}
            </Space>
          </>
        )}
      </Space>
    </div>
  );
};

export default TabFriendsRequest;
