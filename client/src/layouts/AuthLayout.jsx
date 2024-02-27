import logo_light from '~/assets/icon_app.svg';
import {
  Button,
  Checkbox,
  Form,
  Input,
  Flex,
  Row,
  Typography,
  Col,
  Divider
} from 'antd';

import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { Outlet } from 'react-router-dom';

const { Paragraph, Text, Link } = Typography;

const AuthLayout = () => {
  return (
    <Row justify="center" className="h-[100vh] bg-gray-50">
      <Col
        xs={18}
        md={12}
        lg={8}
        className="flex flex-col justify-center items-center"
      >
        <Flex
          gap="small"
          vertical
          justify="center"
          align="center"
          className="w-full mx-auto bg-white rounded-lg px-8"
        >
          <Link href="/" className="cursor-pointer">
            <img src={logo_light} className="object-fill w-[100px] h-[100px]" />
          </Link>
          <Outlet/>
          <Divider orientationMargin="0">Or</Divider>
          <Flex wrap="wrap" gap="middle" className="mb-4">
            <Button shape="round" icon={<FcGoogle />} size="large">
              Log in with Google
            </Button>
            <Button shape="round" icon={<FaGithub />} size="large">
              Log in with Github
            </Button>
          </Flex>
        </Flex>
      </Col>
    </Row>
  );
};

export default AuthLayout;
