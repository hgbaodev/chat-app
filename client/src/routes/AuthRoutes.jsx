import { lazy } from 'react';
import Loadable from '~/components/Loadable';
import AuthRoute from '~/guards/AuthRoute';
import ChangePassword from '~/pages/auth/ChangePassword';
import ForgetPassword from '~/pages/auth/ForgetPassword';
import { store } from '~/store';
import { checkToken } from '~/store/slices/authSlice';

const Login = Loadable(lazy(() => import('~/pages/auth/Login')));
const Register = Loadable(lazy(() => import('~/pages/auth/Register')));
const VerifyEmail = Loadable(lazy(() => import('~/pages/auth/VerifyEmail')));
const Page404 = Loadable(lazy(() => import('~/pages/errors/Page404')));

const { dispatch } = store;

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
        const result = await dispatch(checkToken(token));
        if (result.payload === undefined) {
          throw new Response('Not Found', { status: 404 });
        } else {
          console.log('result', result);
        }
        return null;
      },
      element: <ChangePassword />
    }
  ]
};

export default AuthRoutes;
