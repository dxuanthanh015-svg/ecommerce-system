import React from "react";

const StatCards = ({ stats = {} }) => {
  const hasData = stats && (stats.activeStores || stats.totalProducts || stats.avgCommission);
  
  if (!hasData) {
    return (
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">ACTIVE STORES</div>
          <div className="text-2xl font-bold text-gray-400 mt-2">No data</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">TOTAL PRODUCTS</div>
          <div className="text-2xl font-bold text-gray-400 mt-2">No data</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">AVG. COMMISSION YTD</div>
          <div className="text-2xl font-bold text-gray-400 mt-2">No data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">ACTIVE STORES</div>
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </div>
        <div className="text-3xl font-bold text-gray-900">{stats.activeStores?.toLocaleString() || 'No data'}</div>
        <div className="text-sm text-emerald-600 mt-2 font-medium bg-emerald-50 inline-block px-2 py-1 rounded">~ +12% this month</div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">TOTAL PRODUCTS</div>
          <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>
        <div className="text-3xl font-bold text-gray-900">{(stats.totalProducts || 0).toLocaleString() || 'No data'}</div>
        <div className="text-sm text-gray-500 mt-2">in 'Mobile Phones'</div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">AVG. COMMISSION YTD</div>
          <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div className="text-3xl font-bold text-gray-900">{stats.avgCommission || 'No data'}</div>
        <div className="text-sm text-gray-500 mt-2">Based on 8% rate</div>
      </div>
    </div>
  );
};

export default StatCards;
