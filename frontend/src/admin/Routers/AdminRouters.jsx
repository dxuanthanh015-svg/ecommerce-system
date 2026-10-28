import React from "react";
import StoreManagerLayout from "../components/Layout/StoreManagerLayout";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import AdminSellersPage from "../pages/AdminSellersPage";
import AdminUsersPage from "../pages/AdminUsersPage";
import AdminOrderPage from "../pages/AdminOrderPage";
import AdminPromotionsPage from "../pages/AdminPromotionsPage";
import AdminAnalyticsPage from "../pages/AdminAnalyticsPage";
import AdminSettingsPage from "../pages/AdminSettingsPage";
import { ROLE } from "../../constants/roles";


export const adminRoutes = {
  path: "/admin",
  element: <StoreManagerLayout requiredRole={ROLE.ADMIN} />,
  children: [
    {
      path: "",
      element: <AdminDashboardPage />,
    },
    {
      path: "dashboard",
      element: <AdminDashboardPage />,
    },
    
    {
      path: "sellers",
      element: <AdminSellersPage />,
    },
    {
      path: "users",
      element: <AdminUsersPage />,
    },
    {
      path: "orders",
      element: <AdminOrderPage />,
    },
    {
      path: "promotions",
      element: <AdminPromotionsPage />,
    },
    {
      path: "analytics",
      element: <AdminAnalyticsPage />,
    },
    {
      path: "settings",
      element: <AdminSettingsPage />,
    },
  ],
};
