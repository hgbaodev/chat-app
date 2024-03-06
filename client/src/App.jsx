import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ThemeRoutes } from '~/routes';
import { ConfigProvider } from 'antd';
import { useLayoutEffect } from 'react';
import { getUserFromToken } from '~/store/slices/authSlice';
import { useDispatch } from '~/store';

function App() {
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    const fetchUser = async () => {
      await dispatch(getUserFromToken());
    };
    fetchUser();
  }, [dispatch]);
  // eslint-disable-next-line no-console
  console.info(
    `%c
    ░█▀▀▀░█▀▀▀░█░░█
    ░▀▀▀█░█░▀█░█░░█
    ░▀▀▀▀░▀▀▀▀░▀▀▀▀
  `,
    'color: #0089e2'
  );
  const routes = createBrowserRouter(ThemeRoutes);
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: 'Inter'
        }
      }}
    >
      <RouterProvider router={routes} />
    </ConfigProvider>
  );
}

export default App;
