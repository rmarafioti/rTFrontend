import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store";

import Root from "./layout/Root";
import Home from "./features/Home";
import AuthFormOwner from "./features/auth/AuthFormOwner";
import AuthFormMember from "./features/auth/AuthFormMember";
import DashboardMember from "./features/DashboardMember";
import MemberDrop from "./features/MemberDrop";
import DashboardOwner from "./features/DashboardOwner";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/authowner", element: <AuthFormOwner /> },
      { path: "/authmember", element: <AuthFormMember /> },
      { path: "/dashboardmember/", element: <DashboardMember /> },
      { path: "/memberdrop/", element: <MemberDrop /> },
      { path: "/dashboardowner/", element: <DashboardOwner /> },
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
