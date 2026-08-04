import React from 'react'
import "./ProductCard.css"

const ProductCard = ({product}) => {
  return (
    <div className="productCard w-60 m-3 transition-all cursor-pointer">
        <div className='h-80'>
            <img className='object-cover object-contain w-full h-full' src={product.imageUrl} alt="" />
        </div>

        <div className='textPart bg-white p-3'>
            <div>
                <p className='font-bold opacity-60'>{product.brand}</p>
                <p>{product.title}</p>
            </div>
            <div >
                                <p className='line-through opacity-50'>Price: ${product.price}</p>

                <p className='font-semibold'>Discounted Price: ${product.discountedPrice}</p>
                <p className='text-green-600 font-semibold'> Save {product.discountPersent}%</p>
            </div>
        </div>
    </div>
  )
}

export default ProductCard