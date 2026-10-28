import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StoreHeader from "./StoreHeader";
import StoreTabs from "./StoreTabs";
import StoreProductsGrid from "./StoreProductsGrid";
import { usePublicStoreProducts, useStoreDetail } from "../../../hooks/useStoreQuery";

const CustomerStoreInterface = () => {
  const navigate = useNavigate();
  const { storeId } = useParams();

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: storeData, isLoading: storeLoading, isError: storeError } = useStoreDetail(storeId);
  const { data: filteredProducts = [], isLoading: productsLoading } =
    usePublicStoreProducts(storeId, activeTab, searchQuery);

  if (storeLoading || productsLoading) {
    return <div className="min-h-[50vh] grid place-items-center text-sm text-gray-500">Đang tải thông tin cửa hàng…</div>;
  }

  if (storeError || !storeData) {
    return (
      <div className="min-h-[50vh] grid place-items-center px-4 text-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Không tìm thấy cửa hàng</h1>
          <p className="mt-2 text-sm text-gray-500">Cửa hàng không tồn tại hoặc hiện chưa được công khai.</p>
        </div>
      </div>
    );
  }

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
          storeData={storeData}
          totalProducts={storeData.productCount || 0}
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
