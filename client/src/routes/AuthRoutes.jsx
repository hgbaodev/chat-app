import { lazy } from 'react';
import Loadable from '~/components/Loadable';
import AuthRoute from '~/guards/AuthRoute';

const Login = Loadable(lazy(() => import('~/pages/auth/Login')));
const Register = Loadable(lazy(() => import('~/pages/auth/Register')));
const VerifyEmail = Loadable(lazy(() => import('~/pages/auth/VerifyEmail')));
const Page404 = Loadable(lazy(() => import('~/pages/errors/Page404')));

const AuthRoutes = {
  path: '/auth',
  errorElement: <Page404 />,
  children: [
    {
      path: 'login',
      element: <AuthRoute component={Login} />
    },
    {
      path: 'register',
      element: <Register />
    },
    {
      path: 'verify-email',
      element: <VerifyEmail />
    }
  ]
};

export default AuthRoutes;
