import React from "react";

const UserStatsCard = ({ totalUsers = 0, delta = "" }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">TOTAL USERS</div>
        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
      </div>
      <div className="text-4xl font-bold text-gray-900 mt-2">{totalUsers.toLocaleString()}</div>
      <div className="text-sm text-emerald-600 mt-2 font-medium bg-emerald-50 inline-block px-2 py-1 rounded">{delta}</div>
    </div>
  );
};

export default UserStatsCard;
