import React from "react";
import App from "../../App.jsx";
import HomePage from "../pages/HomePage/HomePage.jsx";
import ProductPage from "../pages/ProductPage/ProductPage.jsx";
import ProductDetailsPage from "../pages/ProductDetailsPage/ProductDetailsPage.jsx";
import CartPage from "../pages/CartPage/CartPage.jsx";
import CheckOutPage from "../pages/CheckOutPage/CheckOutPage.jsx";
import QrCode from "../components/Checkout/QrCode.jsx";
import OrderPage from "../pages/OrderPage/OrderPage.jsx";
import OrderDetailPage from "../pages/OrderDetailPage/OrderDetailPage.jsx";
import SettingPage from "../pages/SettingPage/SettingPage.jsx";
import WishlistPage from "../pages/WishlistPage/WishlistPage.jsx";
import CustomerStorePage from "../pages/CustomerStorePage/CustomerStorePage.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

export const customerRoutes = {
  path: "/",
  element: <App />,
  children: [
    /* Public Routes - Accessible by everyone */
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/home",
      element: <HomePage />,
    },
    {
      path: "/product",
      element: <ProductPage />,
    },
    {
      path: "/productdetails",
      element: <ProductDetailsPage />,
    },
    {
      path: "/productdetails/:productId",
      element: <ProductDetailsPage />,
    },
    {
      path: "/product/:productId",
      element: <ProductDetailsPage />,
    },
    {
      path: "/store/:storeId",
      element: <CustomerStorePage />,
    },
    {
      path: "/store-interface/:storeId",
      element: <CustomerStorePage />,
    },
    {
      path: "/flashsale",
      element: <ProductPage />,
    },
    {
      path: "/trending",
      element: <ProductPage />,
    },

    /* Protected Routes - Only accessible when logged in */
    {
      element: <ProtectedRoute />,
      children: [
        {
          path: "/cart",
          element: <CartPage />,
        },
        {
          path: "/wishlist",
          element: <WishlistPage />,
        },
        {
          path: "/checkout",
          element: <CheckOutPage />,
        },
        {
          path: "/checkout/qr",
          element: <QrCode />,
        },
        {
          path: "/order",
          element: <OrderPage />,
        },
        {
          path: "/orderdetail",
          element: <OrderDetailPage />,
        },
        {
          path: "/setting",
          element: <SettingPage />,
        },
        {
          path: "/profile",
          element: <SettingPage />,
        },
        {
          path: "/account/setting",
          element: <SettingPage />,
        },
        {
          path: "/account/profile",
          element: <SettingPage />,
        },
        {
          path: "/account/order",
          element: <OrderPage />,
        },
        {
          path: "/account/order/:orderId",
          element: <OrderDetailPage />,
        },
      ],
    },

    /* Category Filter Public Routes */
    {
      path: "/:topLavelCategory/:secondLavelCategory/:thirdLavelCategory",
      element: <ProductPage />,
    },
    {
      path: "/:topLavelCategory/:secondLavelCategory",
      element: <ProductPage />,
    },
    {
      path: "/:topLavelCategory",
      element: <ProductPage />,
    },
  ],
};