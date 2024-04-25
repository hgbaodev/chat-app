import { lazy } from 'react';
import Loadable from '~/components/Loadable';
import AuthRoute from '~/guards/AuthRoute';
import ChangePassword from '~/pages/auth/ChangePassword';
import ForgetPassword from '~/pages/auth/ForgetPassword';

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
    },
    {
      path: 'forgot-password',
      element: <ForgetPassword />
    },
    {
      path: 'change-password/:token',
      loader: async ({ params }) => {
        let token = params.token.split('=')[1];
        const value = { token: token };
        if (value) {
          console.log('value', value);
        }
        return null;
      },
      element: <ChangePassword />
    }
  ]
};

export default AuthRoutes;
