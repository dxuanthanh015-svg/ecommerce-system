import React from "react";
import SellerFilters from "./SellerFilters";

const SellerHeader = ({
  searchTerm,
  onSearchChange,
  activeFilter,
  onFilterChange,
  onNewStoreClick,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Seller Management
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Manage platform merchants, review approvals, and monitor store health.
        </p>
      </div>

      <SellerFilters
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        activeFilter={activeFilter}
        onFilterChange={onFilterChange}
        onNewStoreClick={onNewStoreClick}
      />
    </div>
  );
};

export default SellerHeader;
