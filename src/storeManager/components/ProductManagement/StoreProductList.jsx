import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import ProductTableFilter from "./ProductTableFilter";
import ProductTableRow from "./ProductTableRow";
import ProductPagination from "./ProductPagination";
import { product_mock_data } from "../../../Data/product_mock_data";
import {
  PRODUCT_PAGE_SIZE,
  PRODUCT_STATUS_OPTIONS,
} from "./productManagement.data";
import {
  filterProducts,
  getProductCategories,
  paginateProducts,
} from "./productManagement.utils";



const StoreProductList = ({
  productsList,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onToggleVisibility
}) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState(() => {
    if (productsList) return productsList;
    const activeUser = JSON.parse(localStorage.getItem("user"));
    const currentStore = JSON.parse(localStorage.getItem("currentStore"));
    const saved = JSON.parse(localStorage.getItem("products")) || product_mock_data;
    const currentProduct = JSON.parse(localStorage.getItem('currentProducts')) || product_mock_data;
    if (currentProduct) {
      return currentProduct;
    }


    if (activeUser?.isManager && currentStore?.id) {
      const myStoreProducts = saved.filter(
        (item) => String(item.id_store || item.storeId) === String(currentStore.id)
      );
      return myStoreProducts;
    }
  });

  useEffect(() => {
    if (productsList) {
      setProducts(productsList);
    }
  }, [productsList]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [currentPage, setCurrentPage] = useState(1);

  const categories = useMemo(() => getProductCategories(products), [products]);

  const handleToggle = (id) => {
    if (onToggleVisibility) {
      onToggleVisibility(id);
    } else {
      setProducts((prev) => {
        // Tính giá trị mới từ state hiện tại
        const targetItem = prev.find((item) => item.id === id);
        const newIsVisible = targetItem ? !targetItem.isVisible : true;

        // Cập nhật currentProducts
        const updatedCurrent = prev.map((item) =>
          item.id === id ? { ...item, isVisible: newIsVisible } : item
        );
        localStorage.setItem("currentProducts", JSON.stringify(updatedCurrent));

        // Cập nhật products (dùng cùng giá trị newIsVisible)
        const allProds = JSON.parse(localStorage.getItem("products")) || [];
        const updatedAll = allProds.map((item) =>
          item.id === id ? { ...item, isVisible: newIsVisible } : item
        );
        localStorage.setItem("products", JSON.stringify(updatedAll));

        return updatedCurrent;
      });
    }
  };

  // Handle Delete
  const handleDelete = (id) => {
    if (onDeleteProduct) {
      onDeleteProduct(id);
    } else {
      if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
        setProducts((prev) => {
          const updatedCurrentProduct = prev.filter((item) => item.id !== id);
          localStorage.setItem("currentProducts", JSON.stringify(updatedCurrentProduct));

          const product = JSON.parse(localStorage.getItem('products'))
          const updatedProducts = product.filter((item) =>
            item.id != id
          );
          localStorage.setItem("products", JSON.stringify(updatedProducts));
          return updatedCurrentProduct;
        });
      }
    }
  };

  // Handle Edit
  const handleEdit = (id) => {
    if (onEditProduct) {
      onEditProduct(id);
    } else {
      navigate(`/store-manager/products/edit/${id}`);
    }
  };

  const filteredProducts = useMemo(
    () =>
      filterProducts(products, {
        searchTerm,
        selectedCategory,
        selectedStatus,
      }),
    [products, searchTerm, selectedCategory, selectedStatus],
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedStatus]);

  const paginationData = useMemo(
    () => paginateProducts(filteredProducts, currentPage, PRODUCT_PAGE_SIZE),
    [filteredProducts, currentPage],
  );

  useEffect(() => {
    if (currentPage !== paginationData.currentPage) {
      setCurrentPage(paginationData.currentPage);
    }
  }, [currentPage, paginationData.currentPage]);

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Products
          </h1>
        </div>

        <button
          type="button"
          onClick={() =>
            onAddProduct ? onAddProduct() : navigate("/store-manager/products/add")
          }
          className="bg-[#5B21B6] hover:bg-purple-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5 w-fit"
        >
          <AddIcon sx={{ fontSize: 18 }} />
          <span>Add Product</span>
        </button>
      </div>

      {/* Filter & Search Sub-component */}
      <ProductTableFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        categories={categories}
        statuses={PRODUCT_STATUS_OPTIONS}
        totalItems={filteredProducts.length}
        showingFrom={paginationData.showingFrom}
        showingTo={paginationData.showingTo}
      />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50">
                <th className="py-4 px-6">PRODUCT</th>
                <th className="py-4 px-6">CATEGORY</th>
                <th className="py-4 px-6">PRICE</th>
                <th className="py-4 px-6">STATUS</th>
                <th className="py-4 px-6">HIDDEN</th>
                <th className="py-4 px-6 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.length > 0 ? (
                paginationData.items.map((product) => (
                  <ProductTableRow
                    key={product.id}
                    product={product}
                    onToggleVisibility={handleToggle}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={(id) => navigate(`/product/${id}`)}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500 font-medium text-xs">
                    No products found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <ProductPagination
          currentPage={paginationData.currentPage}
          totalPages={paginationData.totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default StoreProductList;


