import React from "react";
import App from "../../App.jsx";
import HomePage from "../pages/HomePage/HomePage.jsx";
import ProductPage from "../pages/ProductPage/ProductPage.jsx";
import ProductDetailsPage from "../pages/ProductDetailsPage/ProductDetailsPage.jsx";
import CartPage from "../pages/CartPage/CartPage.jsx";
import CheckOutPage from "../pages/CheckOutPage/CheckOutPage.jsx";
import OrderPage from "../pages/OrderPage/OrderPage.jsx";
import OrderDetailPage from "../pages/OrderDetailPage/OrderDetailPage.jsx";

export const customerRoutes = {
  path: "/",
  element: <App />,
  children: [
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
      path: "/cart",
      element: <CartPage />,
    },
    {
      path: "/checkout",
      element: <CheckOutPage />,
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
      path: "/:lavelOne/:lavelTwo/:lavelThree",
      element: <ProductPage />,
    },
    {
      path: "/product/:productId",
      element: <ProductDetailsPage />,
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
};