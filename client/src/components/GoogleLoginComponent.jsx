import { jwtDecode } from 'jwt-decode';
import { GoogleLogin } from '@react-oauth/google';

const GoogleLoginComponent = () => {
  const responseMessage = async (response) => {
    var userObject = jwtDecode(response.credential);
    const value = { user_email: userObject.email };
    console.log(value);
  };
  const errorMessage = (error) => {
    console.log(error);
  };
  return <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />;
};

export default GoogleLoginComponent;
