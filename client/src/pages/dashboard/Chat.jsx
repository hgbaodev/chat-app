import { Flex, Grid } from 'antd';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChatContainer } from '~/section/chats/ChatContainer';
import { ContactInfo } from '~/section/chats/ContactInfo';
import { Contacts } from '~/section/chats/Contacts';
import { SharedMessages } from '~/section/chats/SharedMessages';
import { setOpenContactInfo } from '~/store/slices/appSlice';
const { useBreakpoint } = Grid;

const Chat = () => {
  const { contactInfo } = useSelector((state) => state.app);
  const screens = useBreakpoint();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setOpenContactInfo(screens.xl));
  }, [dispatch, screens]);

  return (
    <Flex className="h-full">
      <Contacts
        style={{ boxShadow: '0px 0px 2px rgba(0,0,0,.2)' }}
        className="min-w-[330px]"
      />
      <Flex className="w-full h-full flex-1">
        <ChatContainer />
        {contactInfo.open &&
          (() => {
            switch (contactInfo.type) {
              case 'CONTACT':
                return <ContactInfo />;
              case 'SHARED':
                return <SharedMessages />;
              default:
                return <></>;
            }
          })()}
      </Flex>
    </Flex>
  );
};
export default Chat;
