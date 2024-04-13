import { GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { loginWithGoogle } from '~/store/slices/authSlice';

const GoogleComponent = () => {
  const dispatch = useDispatch();
  const responseMessage = async (response) => {
    const payload = response.credential;
    setTimeout(() => {
      dispatch(loginWithGoogle(payload));
    }, 2000);
  };
  const errorMessage = (error) => {
    console.log(error);
  };
  return (
    <GoogleLogin onSuccess={responseMessage} onError={errorMessage} useOneTap />
  );
};

export default GoogleComponent;
