import { lazy } from 'react';
import Loadable from '~/components/Loadable';

const Login = Loadable(lazy(() => import('~/pages/auth/Login')));
const Register = Loadable(lazy(() => import('~/pages/auth/Register')));

const AuthRoutes = {
  path: "/auth",
  children: [
    {
      path: 'login',
      element: <Login/>,
    },
    {
      path: 'register',
      element: <Register/>,
    }
  ],
};

export default AuthRoutes;
