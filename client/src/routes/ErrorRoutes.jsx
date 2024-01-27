import { lazy } from 'react';
import Loadable from '~/components/Loadable';

const Page404 = Loadable(lazy(() => import('~/pages/errors/Page404')));
const Page403 = Loadable(lazy(() => import('~/pages/errors/Page403')));

const ErrorRoutes = {
  path: 'error',
  children: [
    {
      path: '404',
      element: <Page404 />
    },
    {
      path: '403',
      element: <Page403 />
    }
  ]
};

export default ErrorRoutes;
