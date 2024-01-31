import { lazy } from 'react';
import Loadable from '~/components/Loadable';
import DashboardLayout from '~/layouts/DashboardLayout';
import Chat from '~/pages/dashboard/Chat';
import Contacts from '~/pages/dashboard/Contacts';

// dynamic import
const Settings = Loadable(lazy(() => import('~/pages/dashboard/Settings')));
const Friends = Loadable(lazy(() => import('~/section/contacts/Friends')));
const Groups = Loadable(lazy(() => import('~/section/contacts/Groups')));
const FriendRequests = Loadable(lazy(() => import('~/section/contacts/FriendRequests')));

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
          children: [
            {
              path: '',
              element: <Friends />,
            },
            {
              path: 'friends',
              element: <Friends />,
            },
            {
              path: 'groups',
              element: <Groups />,
            },
            {
              path: 'friend-requests',
              element: <FriendRequests />,
            },
          ],
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
