import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { customerRoutes } from "../customer/Routers/CustomerRouters";
import { storeManagerRoutes } from "../storeManager/Routers/StoreManagerRouters";
import Login from "../customer/components/Login/Login";
import SignUp from "../customer/Signup/SignUp";

export const AppRouters = createBrowserRouter([
  // Standalone Auth Routes (No Header/Footer)
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },

  // Store Manager Routes (/store-manager/*)
  storeManagerRoutes,

  // Customer Routes (/, /product, /cart, /checkout, /order, etc.)
  customerRoutes,
]);
