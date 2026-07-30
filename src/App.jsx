import { useState } from 'react'
import Navigation from './customer/components/Navigation/Navigation.jsx'
import './App.css'
import HomePage from './customer/pages/HomePage/HomePage'
import Footer from './customer/components/Footer/Footer'
import Product from './customer/components/Product/Product.jsx'
import "./App.css"
import ProductPage from './customer/pages/ProductPage/ProductPage.jsx'

function App() {
  return (
    <div className = "">
      <Navigation/>
      <div>
        {/*<HomePage/>*/}
        <ProductPage/>
      </div>
      <Footer/>
    </div>
  )
}

export default App
