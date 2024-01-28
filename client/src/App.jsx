import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ThemeRoutes } from '~/routes';
function App() {
  // eslint-disable-next-line no-console
  console.info(
    `%c
    ░█▀▀▀░█▀▀▀░█░░█
    ░▀▀▀█░█░▀█░█░░█
    ░▀▀▀▀░▀▀▀▀░▀▀▀▀
  `,
    'color: #0089e2',
  );
  const routes = createBrowserRouter(ThemeRoutes);
  return (
    <>
      <RouterProvider router={routes} />
    </>
  );
}

export default App;
