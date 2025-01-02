import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import store from "./store";
import Root from "./layout/Root";
import Home from "./layout/Home";
//authentication
import AuthFormOwner from "./features/auth/AuthFormOwner";
import AuthFormMember from "./features/auth/AuthFormMember";
//business features
import Drop from "./features/buisness/Drop";
//owner features
import OwnerDashboard from "./features/owner/OwnerDashboard";
import OwnerMembersArchive from "./features/owner/OwnerMembersArchive";
import OwnerMembersArchives from "./features/owner/OwnerMembersArchives";
import OwnerMemberArchiveMonth from "./features/owner/OwnerMemberArchiveMonth";
import OwnerMemberProfile from "./features/owner/OwnerMemberProfile";
//member features
import MemberDashboard from "./features/members/MemberDashboard";
import MemberCreateDrop from "./features/members/MemberCreateDrop";
import MemberArchive from "./features/members/MemberArchive";
import MemberArchiveMonth from "./features/members/MemberArchiveMonth";
import MemberNotifications from "./features/members/MemberNotifications";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/authowner", element: <AuthFormOwner /> },
      { path: "/ownerdashboard/", element: <OwnerDashboard /> },
      {
        path: "/ownermembersarchive/:memberId",
        element: <OwnerMembersArchive />,
      },
      {
        path: "/ownermembersarchives/",
        element: <OwnerMembersArchives />,
      },
      {
        path: "/ownermemberarchivemonth/:year/:month/:memberId",
        element: <OwnerMemberArchiveMonth />,
      },
      {
        path: "/ownermemberprofile/:memberId",
        element: <OwnerMemberProfile />,
      },
      { path: "/authmember", element: <AuthFormMember /> },
      { path: "/memberdashboard/", element: <MemberDashboard /> },
      { path: "/membercreatedrop/", element: <MemberCreateDrop /> },
      { path: "/memberarchive/", element: <MemberArchive /> },
      {
        path: "/memberarchivemonth/:year/:month",
        element: <MemberArchiveMonth />,
      },
      { path: "/membernotifications/", element: <MemberNotifications /> },
      { path: "/drop/:dropId", element: <Drop /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
