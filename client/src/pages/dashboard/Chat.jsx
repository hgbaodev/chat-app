import { Col, Flex, Row } from 'antd';
import { useSelector } from 'react-redux';
import { ChatContainer } from '~/section/chats/ChatContainer';
import { ContactInfo } from '~/section/chats/ContactInfo';
import { Contacts } from '~/section/chats/Contacts';

const Chat = () => {
  const { contactInfo } = useSelector((state) => state.app);
  return (
    <Row className="h-full ">
      <Col span={5} className="p-4" style={{ boxShadow: '0px 0px 2px rgba(0,0,0,.2)' }}>
        <Contacts />
      </Col>
      <Col span={19}>
        <Flex className="w-full h-full">
          <ChatContainer />
          {contactInfo.open && <ContactInfo />}
        </Flex>
      </Col>
    </Row>
  );
};
export default Chat;
