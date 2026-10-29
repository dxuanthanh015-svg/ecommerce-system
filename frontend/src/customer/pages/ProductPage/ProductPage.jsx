import Product from '../../components/Product/Product';
import { useProducts } from '../../../hooks/useProductQuery';

const ProductPage = () => {
  // Fetch the full catalog page so category navigation can filter every product,
  // including items beyond the API's default page size.
  const { data: productsData = [], isLoading, isError, refetch } = useProducts({ size: 100 });

  return (
    <div>
      <div>
        <Product
          data={productsData}
          isLoading={isLoading}
          isError={isError}
          onRetry={() => refetch()}
        />
      </div>
    </div>
  );
};

export default ProductPage;
