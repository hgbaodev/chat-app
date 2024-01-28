import { Col, Row } from 'antd';
import { ChatContainer } from '~/section/chats/ChatContainer';
import { Contacts } from '~/section/chats/Contacts';

const Chat = () => {
  return (
    <Row className="h-full ">
      <Col span={5} className="p-4" style={{ boxShadow: '0px 0px 2px rgba(0,0,0,.2)' }}>
        <Contacts />
      </Col>
      <Col span={19}>
        <ChatContainer />
      </Col>
    </Row>
  );
};
export default Chat;
