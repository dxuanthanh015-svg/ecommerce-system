import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { customerRoutes } from "../customer/Routers/CustomerRouters";
import { adminRoutes } from "../admin/Routers/AdminRouters";
import { storeManagerRoutes } from "../storeManager/Routers/StoreManagerRouters";
import Login from "../customer/components/Login/Login";
import SignUp from "../customer/Signup/SignUp";
import OAuthCallback from "../customer/components/Login/OAuthCallback";

export const AppRouters = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/oauth2/callback",
    element: <OAuthCallback />
  },
  adminRoutes,
  customerRoutes,
  storeManagerRoutes
]);
