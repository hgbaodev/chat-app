import { lazy } from 'react';
import Loadable from '~/components/Loadable';

const Login = Loadable(lazy(() => import('~/pages/auth/Login')));
const Register = Loadable(lazy(() => import('~/pages/auth/Register')));
const Page404 = Loadable(lazy(() => import('~/pages/errors/Page404')));

const AuthRoutes = {
  path: '/auth',
  errorElement: <Page404 />,
  children: [
    {
      path: 'login',
      element: <Login />
    },
    {
      path: 'register',
      element: <Register />
    }
  ]
};

export default AuthRoutes;
