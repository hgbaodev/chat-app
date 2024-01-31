import { Col, Flex, Grid, Row } from 'antd';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChatContainer } from '~/section/chats/ChatContainer';
import { ContactInfo } from '~/section/chats/ContactInfo';
import { Contacts } from '~/section/chats/Contacts';
import { setOpenContact } from '~/store/slices/appSlice';
const { useBreakpoint } = Grid;

const Chat = () => {
  const { contactInfo } = useSelector((state) => state.app);
  const screens = useBreakpoint();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!screens.xl) {
      dispatch(setOpenContact(false));
    }
  }, [dispatch, screens]);

  return (
    <Row className="h-full">
      <Col span={6} style={{ boxShadow: '0px 0px 2px rgba(0,0,0,.2)' }}>
        <Contacts />
      </Col>
      <Col span={18}>
        <Flex className="w-full h-full">
          <ChatContainer />
          {contactInfo.open && <ContactInfo />}
        </Flex>
      </Col>
    </Row>
  );
};
export default Chat;
