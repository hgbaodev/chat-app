import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ThemeRoutes } from "~/routes";
import { ConfigProvider } from "antd";
function App() {
  // eslint-disable-next-line no-console
  console.info(
    `%c
    ░█▀▀▀░█▀▀▀░█░░█
    ░▀▀▀█░█░▀█░█░░█
    ░▀▀▀▀░▀▀▀▀░▀▀▀▀
  `,
    "color: #0089e2"
  );
  const routes = createBrowserRouter(ThemeRoutes);
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "Inter",
        },
      }}
    >
      <RouterProvider router={routes} />
    </ConfigProvider>
  );
}

export default App;
