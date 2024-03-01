import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ component: Component }) => {
  const { isAuthenticated, isLoaded } = useSelector((state) => state.auth);

  if (Cookies.get('token')) {
    if (isLoaded) {
      if (!isAuthenticated) {
        return <Navigate to="/auth/login" replace={true} />;
      }
      return <Component />;
    }
  } else {
    return <Navigate to="/auth/login" replace={true} />;
  }
};

export default PrivateRoute;
