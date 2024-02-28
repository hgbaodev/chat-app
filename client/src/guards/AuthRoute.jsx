import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AuthRoute = ({ component: Component }) => {
  const { isAuthenticated, isLoaded } = useSelector((state) => state.auth);
  if (isLoaded && isAuthenticated) {
    return <Navigate to="/" replace={true} />;
  }
  return <Component />;
};

export default AuthRoute;
