import React from "react";
import SellerFilters from "../components/SellerManagement/SellerFilters";
import SellerTable from "../components/SellerManagement/SellerTable";

const AdminSellersPage = () => {
  return (
    <div className="min-h-screen bg-[#f8f7f9] font-sans">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Seller Management</h1>
          <p className="text-sm text-gray-500">Manage platform merchants, review approvals, and monitor store health.</p>
        </div>
        <div className="flex items-center gap-3">
          <SellerFilters />
          <button className="bg-black text-white px-4 py-2 rounded-lg text-sm">+ New Store</button>
        </div>
      </div>

      <div className="bg-transparent">
        <SellerTable />
      </div>
    </div>
  );
};

export default AdminSellersPage;
