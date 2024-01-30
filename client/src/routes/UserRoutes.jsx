import DashboardLayout from "~/layouts/DashboardLayout";
import Chat from "~/pages/dashboard/Chat";
import Contacts from "~/pages/dashboard/Contacts";
import Settings from "~/pages/dashboard/Settings";

const UserRoutes = {
  path: "/",
  children: [
    {
      path: "/",
      element: <DashboardLayout />,
      children: [
        {
          path: "/",
          element: <Chat />,
        },
        {
          path: "contacts",
          element: <Contacts />,
        },
        {
          path: "settings",
          element: <Settings />,
        },
      ],
    },
  ],
};

export default UserRoutes;
