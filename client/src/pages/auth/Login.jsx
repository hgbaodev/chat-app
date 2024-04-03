import logo_light from '~/assets/icon_app.svg';
import { Flex, Row, Typography, Col, Divider, Space, Button } from 'antd';

import { Link, useSearchParams } from 'react-router-dom';
import FormLogin from '~/section/auth/FormLogin';
import { FaGithub } from 'react-icons/fa';
import { useEffect } from 'react';
import {
  REACT_APP_GITHUB_CLIENT_ID,
  REACT_APP_GOOGLE_CLIENT_ID
} from '~/config';
import { useDispatch } from 'react-redux';
import { loginWithGithub, loginWithGoogle } from '~/store/slices/authSlice';

const { Text } = Typography;

const Login = () => {
  const dispatch = useDispatch();
  const [searchparams] = useSearchParams();
  const handleLoginWithGoogle = (response) => {
    const payload = response.credential;
    setTimeout(() => {
      dispatch(loginWithGoogle(payload));
    }, 1000);
  };
  const handleLoginWithGithub = () => {
    window.location.assign(
      `https://github.com/login/oauth/authorize/?client_id=${REACT_APP_GITHUB_CLIENT_ID}`
    );
  };

  const send_github__code_to_server = async () => {
    if (searchparams) {
      try {
        const urlparam = searchparams.get('code');
        dispatch(loginWithGithub(urlparam));
      } catch (error) {
        if (error.response) {
          console.log(error.response.data);
        }
      }
    }
  };
  let code = searchparams.get('code');
  useEffect(() => {
    if (code) {
      send_github__code_to_server();
    }
  }, [code]);

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: REACT_APP_GOOGLE_CLIENT_ID,
      callback: handleLoginWithGoogle
    });
    google.accounts.id.renderButton(document.getElementById('signInDiv'), {
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      shape: 'circle',
      width: '280'
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
          className="w-full mx-auto bg-white rounded-lg py-3 px-8"
        >
          <Link href="/" className="cursor-pointer">
            <img src={logo_light} className="object-fill w-[100px] h-[100px]" />
          </Link>
          <Space direction="vertical">
            <div className="googleContainer">
              <div id="signInDiv" className="gsignIn"></div>
            </div>
            <Button
              shape="round"
              icon={<FaGithub />}
              size="large"
              className="w-full"
              onClick={handleLoginWithGithub}
            >
              Github
            </Button>
          </Space>
          <Divider>Or</Divider>
          <Text className="text-2xl font-medium mb-5">
            Sign in to your account
          </Text>
          <FormLogin />
        </Flex>
      </Col>
    </Row>
  );
};

export default Login;
