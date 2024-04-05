import { Button } from 'antd';
import { useEffect } from 'react';
import { FaGithub } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { REACT_APP_GITHUB_CLIENT_ID } from '~/config';
import { loginWithGithub } from '~/store/slices/authSlice';

const GithubComponent = () => {
  const dispatch = useDispatch();
  const [searchparams] = useSearchParams();
  const handleLoginWithGithub = () => {
    window.location.assign(
      `https://github.com/login/oauth/authorize/?client_id=${REACT_APP_GITHUB_CLIENT_ID}`
    );
  };

  let code = searchparams.get('code');
  useEffect(() => {
    if (code) {
      try {
        const urlparam = code;
        dispatch(loginWithGithub(urlparam));
      } catch (error) {
        if (error.response) {
          console.log(error.response.data);
        }
      }
    }
  }, [code, dispatch]);
  return (
    <Button
      icon={<FaGithub />}
      size="large"
      className="w-full"
      onClick={handleLoginWithGithub}
    >
      Github
    </Button>
  );
};

export default GithubComponent;
