import { GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { loginWithGoogle } from '~/store/slices/authSlice';

const GoogleComponent = () => {
  const dispatch = useDispatch();
  const responseMessage = (response) => {
    console.log(response);
    const payload = response.credential;
    dispatch(loginWithGoogle(payload));
  };
  const errorMessage = (error) => {
    console.log(error);
  };
  return (
    <GoogleLogin onSuccess={responseMessage} onError={errorMessage} useOneTap />
  );
};

export default GoogleComponent;
