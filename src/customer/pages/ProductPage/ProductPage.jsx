import React from 'react'
import Product from '../../components/Product/Product'
import { product_mock_data } from '../../../Data/product_mock_data'

const ProductPage = () => {
  return (
    <div>
        <div>
            <Product data={product_mock_data}/>
        </div>
    </div>
  )
}

export default ProductPage