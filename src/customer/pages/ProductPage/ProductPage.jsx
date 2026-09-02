import Product from '../../components/Product/Product';
import { productService } from '../../../services';
import { useProducts } from '../../../hooks/useProductQuery';
import { product_mock_data } from '../../../Data/product_mock_data';

const ProductPage = () => {
  const { data: productsData = product_mock_data, isLoading } = useProducts();

  return (
    <div>
      <div>
        <Product data={productsData} />
      </div>
    </div>
  );
};

export default ProductPage;