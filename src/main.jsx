import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store";

import Root from "./layout/Root";
import Home from "./layout/Home";
import AuthFormOwner from "./features/auth/AuthFormOwner";
import OnboardOwner from "./features/owner/OnboardOwner";
import DashboardOwner from "./features/owner/DashboardOwner";
import OwnerHandleDrops from "./features/owner/OwnerHandleDrops";
import AuthFormMember from "./features/auth/AuthFormMember";
import OnboardMember from "./features/members/OnboardMember";
import DashboardMember from "./features/members/DashboardMember";
import MemberDrop from "./features/members/MemberDrop";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/authowner", element: <AuthFormOwner /> },
      { path: "/owneronboard/", element: <OnboardOwner /> },
      { path: "/ownerdashboard/", element: <DashboardOwner /> },
      { path: "/ownerhandledrops/", element: <OwnerHandleDrops /> },
      { path: "/authmember", element: <AuthFormMember /> },
      { path: "/memberonboard/", element: <OnboardMember /> },
      { path: "/memberdashboard/", element: <DashboardMember /> },
      { path: "/memberdrop/", element: <MemberDrop /> },
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
