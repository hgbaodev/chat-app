import DashboardLayout from "~/layouts/DashboardLayout";
import Chat from "~/pages/dashboard/Chat";

const UserRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: '/',
          element: <Chat/>
        }
      ]
    }
  ]
};

export default UserRoutes;