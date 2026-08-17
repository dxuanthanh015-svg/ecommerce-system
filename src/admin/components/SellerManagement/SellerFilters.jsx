import React from "react";

const SellerFilters = () => {
  return (
    <div className="flex items-center gap-2">
      <input placeholder="Search stores..." className="border border-gray-200 rounded-lg py-2 px-3 text-sm" />
      <button className="border border-gray-200 rounded-lg px-3 py-2 text-sm">Filter</button>
    </div>
  );
};

export default SellerFilters;
