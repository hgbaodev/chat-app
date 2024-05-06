import { Flex, Row, Typography, Col, Button } from 'antd';
import FormForgetPassword from '~/section/auth/FormForgetPassword';
import SendIcon from '~/assets/sendIcon';
import { useSelector } from 'react-redux';

const { Text } = Typography;

const ForgetPassword = () => {
  const { sendForgotPassword, emailForgotPassword } = useSelector(
    (state) => state.auth
  );
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
          className="w-full mx-auto bg-white rounded-lg p-6"
        >
          {!sendForgotPassword ? (
            <>
              <Text className="text-xl font-medium mb-3 text-center">
                Forgot password
              </Text>
              <FormForgetPassword />
            </>
          ) : (
            <>
              <SendIcon color="#1677ff" />
              <Typography.Title level={3} className="mb-3 text-center">
                Request sent successfully
              </Typography.Title>
              <Typography.Text className="text-center mb-4">
                We have sent a confirmation email to &nbsp;
                <strong>{emailForgotPassword}</strong>
                <br />
                Please check your email.
              </Typography.Text>
              <Button size="large" type="primary" href="/" sx={{ mt: 5 }}>
                Back
              </Button>
            </>
          )}
        </Flex>
      </Col>
    </Row>
  );
};

export default ForgetPassword;
