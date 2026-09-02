import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StoreHeader from "./StoreHeader";
import StoreTabs from "./StoreTabs";
import StoreProductsGrid from "./StoreProductsGrid";
import store_manager_mock_data from "../../../Data/store-manager_mock_data";
import { product_mock_data } from "../../../Data/product_mock_data";
import { useProducts } from "../../../hooks/useProductQuery";
import { useAllStores } from "../../../hooks/useStoreQuery";

const CustomerStoreInterface = () => {
  const navigate = useNavigate();
  const { storeId } = useParams();

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: allStores = store_manager_mock_data } = useAllStores();
  const { data: allProds = product_mock_data } = useProducts();

  const storeData = allStores.find((s) => String(s.id) === String(storeId)) || store_manager_mock_data.find((s) => String(s.id) === String(storeId)) || allStores[0];
  const storeProducts = allProds.filter((item) => {
    const pStoreId = item.id_store || item.storeId;
    return String(pStoreId) === String(storeData?.id);
  });

  // Filter products based on selected tab & search query
  const filteredProducts = useMemo(() => {
    return storeProducts.filter((product) => {
      // Search query filter
      if (searchQuery && searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = product.title?.toLowerCase().includes(q);
        const brandMatch = product.brand?.toLowerCase().includes(q);
        const descMatch = product.description?.toLowerCase().includes(q);
        const catMatch = product.topLavelCategory?.toLowerCase().includes(q) || product.secondLavelCategory?.toLowerCase().includes(q);
        if (!titleMatch && !brandMatch && !descMatch && !catMatch) {
          return false;
        }
      }

      // Tab filter
      if (activeTab === "bestseller") {
        return Boolean(
          product.isTrending ||
          Number(product.rating) >= 4.7 ||
          (product.claimedPercent && product.claimedPercent >= 50) ||
          product.badge === "HOT"
        );
      }
      if (activeTab === "new") {
        return Boolean(
          product.badge === "NEW" ||
          product.isNew ||
          String(product.id).includes("fs-001") ||
          String(product.id).includes("fs-002") ||
          String(product.id).includes("fs-003") ||
          String(product.id).includes("prod_") ||
          !product.isFlashSale
        );
      }
      if (activeTab === "sale") {
        return Boolean(
          (product.discountedPrice && product.discountedPrice < product.price) ||
          product.isFlashSale ||
          (product.discountPersent && product.discountPersent > 0)
        );
      }

      return true;
    });
  }, [storeProducts, activeTab, searchQuery]);

  if (!storeData) return null;

  return (
    <div className="min-h-screen bg-[#fafbfc] font-sans pb-20">
      {/* Top Back Navigation Bar */}
      <div className="bg-white border-b border-gray-100 py-3 px-4 sm:px-8 sticky top-0 z-20 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            <ArrowBackIcon sx={{ fontSize: 18 }} />
            <span>Quay lại trang trước</span>
          </button>

          <span className="text-xs font-medium text-gray-400">
            Gian hàng chính hãng • NexCart Mall
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {/* Store Header & Stats Banner */}
        <StoreHeader
          store={storeData}
          totalProductsCount={storeProducts.length}
        />

        {/* Store Tabs & In-Store Search */}
        <StoreTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onTabChange={setActiveTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearchChange={setSearchQuery}
          totalCount={filteredProducts.length}
        />

        {/* Filtered Products Grid */}
        <StoreProductsGrid
          products={filteredProducts}
          storeName={storeData.name}
        />
      </div>
    </div>
  );
};

export default CustomerStoreInterface;
