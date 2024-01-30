import DashboardLayout from "~/layouts/DashboardLayout";
import Chat from "~/pages/dashboard/Chat";
import Friends from "~/pages/dashboard/Friends";
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
          path: "friends",
          element: <Friends />,
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
