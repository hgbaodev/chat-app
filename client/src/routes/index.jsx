import { Suspense, lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import { GeneralApp } from '../pages/dashboard/GeneralApp';
import EmptyLayout from '~/layouts/EmptyLayout';
import DashboardLayout from '~/layouts/DashboardLayout';
import AdminLayout from '~/layouts/AdminLayout';

const Loadable = (Component) => (props) => {
  return (
    <Suspense fallback={<h1>Loading</h1>}>
      <Component {...props} />
    </Suspense>
  );
};

export const Router = () => {
  return useRoutes([
    {
      path: '/auth',
      element: <EmptyLayout />,
      children: [
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
      ],
    },
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'app',
          element: <GeneralApp />,
          children: [
            { path: 'chat/:chatId', element: <Chat /> },
            { path: '*', element: <EmptyChat /> },
          ],
        },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/app" replace /> },
      ],
    },
    {
      path: '/admin',
      element: <AdminLayout />,
      children: [{ path: '', element: <h1>hahaha</h1> }],
    },

    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
};
const Page404 = Loadable(lazy(() => import('../pages/errors/Page404')));
const Login = Loadable(lazy(() => import('../pages/auth/Login')));
const Register = Loadable(lazy(() => import('../pages/auth/Register')));
const Chat = Loadable(lazy(() => import('../pages/dashboard/Chat')));
const EmptyChat = Loadable(lazy(() => import('../pages/dashboard/EmptyChat')));
