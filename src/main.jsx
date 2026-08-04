import { Children, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, RouterProvider, createBrowserRouter } from 'react-router-dom'
import HomePage from './customer/pages/HomePage/HomePage.jsx'
import ProductPage from './customer/pages/ProductPage/ProductPage.jsx'
import ProductDetailsPage from './customer/pages/ProductDetailsPage/ProductDetailsPage.jsx'
import CartPage from './customer/pages/CartPage/CartPage.jsx'
import CheckOutPage from './customer/pages/CheckOutPage/CheckOutPage.jsx'

const router = createBrowserRouter([
{
  path: "/",
  element: <App/>,
  children : [
    {
      path : "/",
      element : <HomePage/>
    },
    {
      path : "/home",
      element : <HomePage/>
    },
    {
      path : "/product",
      element : <ProductPage/>
    },
    {
      path : "/productdetails",
      element : <ProductDetailsPage/>
    },
    {
      path : "/cart",
      element : <CartPage/>
    },
    {
      path : "/checkout",
      element : <CheckOutPage/>
    }
  ]
}
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
