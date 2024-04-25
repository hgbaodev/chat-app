import { Flex, Row, Col, Typography } from 'antd';
import FormChangePassword from '~/section/auth/FormChangePassword';

const { Text } = Typography;

const ChangePassword = () => {
  return (
    <Row justify="center" className="h-[100vh] bg-neutral-100">
      <Col
        xs={20}
        md={16}
        lg={12}
        xl={8}
        className="flex flex-col justify-center items-center"
      >
        <Flex
          gap="small"
          vertical
          justify="center"
          align="center"
          className="w-full mx-auto bg-white rounded-lg p-6"
        >
          <Text className="text-xl font-medium mb-3">Change password</Text>
          <FormChangePassword />
        </Flex>
      </Col>
    </Row>
  );
};

export default ChangePassword;
