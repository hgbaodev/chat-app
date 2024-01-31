import { lazy } from 'react';
import Loadable from '~/components/Loadable';
import DashboardLayout from '~/layouts/DashboardLayout';
import Chat from '~/pages/dashboard/Chat';
import Contacts from '~/pages/dashboard/Contacts';

// dynamic import
const Settings = Loadable(lazy(() => import('~/pages/dashboard/Settings')));

const UserRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: '/',
          element: <Chat />,
        },
        {
          path: '/contacts',
          element: <Contacts />,
        },
        {
          path: 'settings',
          element: <Settings />,
        },
      ],
    },
  ],
};

export default UserRoutes;
