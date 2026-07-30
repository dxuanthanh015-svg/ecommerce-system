import React from 'react'
import Product from '../../components/Product/Product'
import { mens_kurta } from '../../../Data/mens-kurta'

const ProductPage = () => {
  return (
    <div>
        <div>
            <Product data={mens_kurta}/>
        </div>
    </div>
  )
}

export default ProductPage