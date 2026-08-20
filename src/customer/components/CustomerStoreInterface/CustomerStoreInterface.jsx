import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StoreHeader from "./StoreHeader";
import StoreTabs from "./StoreTabs";
import StoreProductsGrid from "./StoreProductsGrid";
import store_manager_mock_data from "../../../Data/store-manager_mock_data";
import { product_mock_data } from "../../../Data/product_mock_data";

const CustomerStoreInterface = () => {
  const navigate = useNavigate();
  const { storeId } = useParams();

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Retrieve store information from localStorage or mock data
  const storeData = useMemo(() => {
    const customStores = JSON.parse(localStorage.getItem("stores")) || [];
    const allStores = [...customStores, ...store_manager_mock_data];
    return (
      allStores.find((s) => String(s.id) === String(storeId)) ||
      store_manager_mock_data[0]
    );
  }, [storeId]);

  // Filter products belonging to this store
  const storeProducts = useMemo(() => {
    const allProducts = JSON.parse(localStorage.getItem("products")) || product_mock_data;
    return allProducts.filter((item) => {
      const pStoreId = item.id_store || item.storeId;
      const visibleMatch = item.isVisible !== true;
      return String(pStoreId) === String(storeData?.id) && visibleMatch;
    });
  }, [storeData]);

  // Filter products based on selected tab & search query
  const filteredProducts = useMemo(() => {
    return storeProducts.filter((product) => {
      // Search query filter
      if (
        searchQuery &&
        !product.title.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Tab filter
      if (activeTab === "bestseller") {
        return product.discountedPrice < product.price;
      }
      if (activeTab === "new") {
        return product.badge === "NEW" || product.id % 2 === 0;
      }
      if (activeTab === "sale") {
        return product.discountedPrice && product.discountedPrice < product.price;
      }

      return true;
    });
  }, [storeProducts, activeTab, searchQuery]);

  return (
    <div className="bg-[#f8f9fc]/60 min-h-screen py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Navigation Link */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-indigo-600 mb-6 transition-colors cursor-pointer"
        >
          <ArrowBackIcon sx={{ fontSize: 16 }} />
          <span>Quay lại</span>
        </button>

        {/* Store Header Banner Component */}
        <StoreHeader storeData={storeData} totalProducts={storeProducts.length} />

        {/* Store Navigation Tabs Component */}
        <StoreTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          totalCount={filteredProducts.length}
        />

        {/* Store Products Grid Component */}
        <StoreProductsGrid products={filteredProducts} />

      </div>
    </div>
  );
};

export default CustomerStoreInterface;
