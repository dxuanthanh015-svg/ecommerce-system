import React from "react";
import StoreManagerLayout from "../components/Layout/StoreManagerLayout";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import AdminSellersPage from "../pages/AdminSellersPage";
import AdminUsersPage from "../pages/AdminUsersPage";
import AdminOrderPage from "../pages/AdminOrderPage";
import AdminCategoriesPage from "../pages/AdminCategoriesPage";
import AdminPromotionsPage from "../pages/AdminPromotionsPage";
import AdminAnalyticsPage from "../pages/AdminAnalyticsPage";
import AdminSettingsPage from "../pages/AdminSettingsPage";
import AdminFinancialsPage from "../pages/AdminFinancialsPage";
import StoreDashboard from "../components/Dashboard/StoreDashboard";


export const adminRoutes = {
  path: "/admin",
  element: <StoreManagerLayout />,
  children: [
    {
      path: "",
      element: <StoreDashboard />,
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
      path: "categories",
      element: <AdminCategoriesPage />,
    },
    {
      path: "financials",
      element: <AdminFinancialsPage />,
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
