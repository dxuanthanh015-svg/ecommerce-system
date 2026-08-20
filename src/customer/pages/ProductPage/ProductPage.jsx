import React from 'react';
import Product from '../../components/Product/Product';
import { product_mock_data } from '../../../Data/product_mock_data';

const ProductPage = () => {
  const savedProducts = JSON.parse(localStorage.getItem("products"));
  const productsData = (savedProducts && savedProducts.length > 0) ? savedProducts : product_mock_data;

  return (
    <div>
      <div>
        <Product data={productsData} />
      </div>
    </div>
  );
};

export default ProductPage;