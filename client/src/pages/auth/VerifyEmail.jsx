import { Flex, Row, Typography, Col } from 'antd';

import VerifyImage from '~/assets/verify.png';
import FormVerifyEmail from '~/section/auth/FormVerifyEmail';

const { Text, Paragraph } = Typography;

const VerifyEmail = () => {
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
          <img src={VerifyImage} className="object-fill w-[100px] h-[100px]" />
          <Text className="text-2xl font-medium">Please check your email!</Text>
          <Paragraph className="text-center text-sm text-gray-500">
            We have emailed a 6-digit confirmation code to acb@domain, please
            enter the code in below box to verify your email.
          </Paragraph>
          <FormVerifyEmail />
        </Flex>
      </Col>
    </Row>
  );
};

export default VerifyEmail;
