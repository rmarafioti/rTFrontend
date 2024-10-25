import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store";

import Root from "./layout/Root";
import Home from "./layout/Home";
import AuthFormOwner from "./features/auth/AuthFormOwner";
import OwnerOnboard from "./features/owner/OwnerOnboard";
import OwnerDashboard from "./features/owner/OwnerDashboard";
import OwnerHandleDrops from "./features/owner/OwnerHandleDrops";
import AuthFormMember from "./features/auth/AuthFormMember";
import MemberOnboard from "./features/members/MemberOnboard";
import MemberDashboard from "./features/members/MemberDashboard";
import MemberCreateDrop from "./features/members/MemberCreateDrop";
import MemberEditDrops from "./features/members/MemberEditDrops";
import MemberHandleDrops from "./features/members/MemberHandleDrops";
import MemberArchive from "./features/members/MemberArchive";
import MemberDrop from "./features/members/MemberDrop";

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
      { path: "/ownerhandledrops/", element: <OwnerHandleDrops /> },
      { path: "/authmember", element: <AuthFormMember /> },
      { path: "/memberonboard/", element: <MemberOnboard /> },
      { path: "/memberdashboard/", element: <MemberDashboard /> },
      { path: "/membercreatedrop/", element: <MemberCreateDrop /> },
      { path: "/membereditdrops/", element: <MemberEditDrops /> },
      { path: "/memberhandledrops/", element: <MemberHandleDrops /> },
      { path: "/memberarchive/", element: <MemberArchive /> },
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
