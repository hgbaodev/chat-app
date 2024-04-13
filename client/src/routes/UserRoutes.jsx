import { lazy } from 'react';
import Loadable from '~/components/Loadable';
import PrivateRoute from '~/guards/PrivateRoute';
import DashboardLayout from '~/layouts/DashboardLayout';
import Chat from '~/pages/dashboard/Chat';
import Contacts from '~/pages/dashboard/Contacts';
import CallWrapper from '~/section/call/CallWrapper';

// dynamic import
const Settings = Loadable(lazy(() => import('~/pages/dashboard/Settings')));
const Page404 = Loadable(lazy(() => import('~/pages/errors/Page404')));

const UserRoutes = {
  path: '/',
  errorElement: <Page404 />,
  children: [
    {
      path: '/',
      element: <PrivateRoute component={DashboardLayout} />,
      children: [
        {
          path: '/',
          element: <Chat />
        },
        {
          path: 'contacts',
          element: <Contacts />
        },
        {
          path: 'settings',
          element: <Settings />
        }
      ]
    },
    {
      path: '/call/:call_type/:conversation_id/:peer_id',
      element: <CallWrapper />
    }
  ]
};

export default UserRoutes;
