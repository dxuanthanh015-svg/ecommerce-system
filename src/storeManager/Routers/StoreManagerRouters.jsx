import React from "react";
import StoreManagerLayout from "../components/Layout/StoreManagerLayout";
import StoreDashboard from "../components/Dashboard/StoreDashboard";
import StoreProductList from "../components/ProductManagement/StoreProductList";
import AddProductForm from "../components/ProductManagement/AddProductForm";
import StoreOrderList from "../components/OrderManagement/StoreOrderList";
import StorePromotions from "../components/Promotions/StorePromotions";
import StoreAnalytics from "../components/Analytics/StoreAnalytics";
import StoreSettings from "../components/StoreSettings/StoreSettings";

export const storeManagerRoutes = {
  path: "/store-manager",
  element: <StoreManagerLayout />,
  children: [
    {
      path: "",
      element: <StoreDashboard />,
    },
    {
      path: "dashboard",
      element: <StoreDashboard />,
    },
    {
      path: "products",
      element: <StoreProductList />,
    },
    {
      path: "products/add",
      element: <AddProductForm isEdit={false} />,
    },
    {
      path: "products/edit/:productId",
      element: <AddProductForm isEdit={true} />,
    },
    {
      path: "orders",
      element: <StoreOrderList />,
    },
    {
      path: "promotions",
      element: <StorePromotions />,
    },
    {
      path: "analytics",
      element: <StoreAnalytics />,
    },
    {
      path: "settings",
      element: <StoreSettings />,
    },
  ],
};
