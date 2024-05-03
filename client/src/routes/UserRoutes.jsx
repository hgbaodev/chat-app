import { lazy } from 'react';
import Loadable from '~/components/Loadable';
import PrivateRoute from '~/guards/PrivateRoute';
import DashboardLayout from '~/layouts/DashboardLayout';

const Page404 = Loadable(lazy(() => import('~/pages/errors/Page404')));
const Chat = Loadable(lazy(() => import('~/pages/dashboard/Chat')));
const Contacts = Loadable(lazy(() => import('~/pages/dashboard/Contacts')));
const CallWrapper = Loadable(lazy(() => import('~/section/call/CallWrapper')));

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
