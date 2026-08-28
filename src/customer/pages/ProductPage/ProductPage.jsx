import React, { useState, useEffect } from 'react';
import Product from '../../components/Product/Product';
import { productService } from '../../../services';

const ProductPage = () => {
  const [productsData, setProductsData] = useState([]);

  useEffect(() => {
    productService.fetchProducts()
      .then((data) => setProductsData(data || []))
      .catch((err) => console.error("Error loading products in ProductPage:", err));
  }, []);

  return (
    <div>
      <div>
        <Product data={productsData} />
      </div>
    </div>
  );
};

export default ProductPage;