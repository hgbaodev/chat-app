import {
  Button,
  Flex,
  Row,
  Typography,
  Col,
  Divider,
  Space
} from 'antd';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import FormRegister from '~/section/auth/FormRegister';

const { Text, Paragraph } = Typography;

const RegisterPage = () => {
  return (
    <Row justify="center" className="h-[100vh] bg-neutral-100">
      <Col
        xs={24}
        md={12}
        lg={8}
        className="flex flex-col justify-center items-center"
      >
        <Flex
          gap="small"
          vertical
          justify="center"
          align="center"
          className="w-full mx-auto bg-white rounded-lg p-6"
        >
          <Text className="text-2xl font-medium">Sign Up to Chat App</Text>
          <Paragraph className="text-center text-xs text-gray-500">
            Already a member ? <Link to="/auth/login"> Sign In</Link>
          </Paragraph>

          <Space direction="vertical" className="w-full">
            <Button
              shape="round"
              icon={<FcGoogle />}
              size="large"
              className="w-full"
            >
              Sign up with Google
            </Button>
            {/* <Button
              shape="round"
              icon={<FaGithub />}
              size="large"
              className="w-full"
            >
              Sign up with Github
            </Button> */}
          </Space>
          <Divider>Or</Divider>
          <FormRegister />
        </Flex>
      </Col>
    </Row>
  );
};


export default RegisterPage;
