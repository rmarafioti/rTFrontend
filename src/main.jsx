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
//owner features
import OwnerOnboard from "./features/owner/OwnerOnboard";
import OwnerDashboard from "./features/owner/OwnerDashboard";
import OwnerMembersArchive from "./features/owner/OwnerMembersArchive";
import OwnerMembersArchives from "./features/owner/OwnerMembersArchives";
import OwnerMemberArchiveMonth from "./features/owner/OwnerMemberArchiveMonth";
import OwnerMemberDrop from "./features/owner/OwnerMemberDrop";
import OwnerMemberProfile from "./features/owner/OwnerMemberProfile";
//member features
import MemberOnboard from "./features/members/MemberOnboard";
import MemberDashboard from "./features/members/MemberDashboard";
import MemberCreateDrop from "./features/members/MemberCreateDrop";
import MemberArchive from "./features/members/MemberArchive";
import MemberArchiveMonth from "./features/members/MemberArchiveMonth";
import MemberDrop from "./features/members/MemberDrop";
import MemberNotifications from "./features/members/MemberNotifications";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/authowner", element: <AuthFormOwner /> },
      { path: "/owneronboard/", element: <OwnerOnboard /> },
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
      { path: "/ownermemberdrop/:dropId", element: <OwnerMemberDrop /> },
      {
        path: "/ownermemberprofile/:memberId",
        element: <OwnerMemberProfile />,
      },
      { path: "/authmember", element: <AuthFormMember /> },
      { path: "/memberonboard/", element: <MemberOnboard /> },
      { path: "/memberdashboard/", element: <MemberDashboard /> },
      { path: "/membercreatedrop/", element: <MemberCreateDrop /> },
      { path: "/memberarchive/", element: <MemberArchive /> },
      {
        path: "/memberarchivemonth/:year/:month",
        element: <MemberArchiveMonth />,
      },
      { path: "/memberdrop/:dropId", element: <MemberDrop /> },
      { path: "/membernotifications/", element: <MemberNotifications /> },
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
