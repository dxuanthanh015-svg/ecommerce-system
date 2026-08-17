import React from "react";

const StatCards = ({ stats = {} }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="text-xs text-gray-500">ACTIVE STORES</div>
        <div className="text-2xl font-extrabold">{stats.activeStores?.toLocaleString()}</div>
        <div className="text-xs text-gray-400">~ +12% this month</div>
      </div>
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="text-xs text-gray-500">TOTAL PRODUCTS</div>
        <div className="text-2xl font-extrabold">{(stats.totalProducts || 0).toLocaleString()}</div>
        <div className="text-xs text-gray-400">in 'Mobile Phones'</div>
      </div>
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="text-xs text-gray-500">AVG. COMMISSION YTD</div>
        <div className="text-2xl font-extrabold">{stats.avgCommission}</div>
        <div className="text-xs text-gray-400">Based on 8% rate</div>
      </div>
    </div>
  );
};

export default StatCards;
