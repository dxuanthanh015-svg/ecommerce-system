import React from "react";

const UserFilters = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input placeholder="Search users, sellers..." className="border border-gray-300 rounded-lg py-2.5 pl-10 pr-4 text-sm w-72 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          onChange={(e) => onSearchChange(e.target.value)}
          value={searchTerm}
        />
      </div>
      <button className="border border-gray-300 hover:bg-gray-50 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors">Filter</button>
    </div>
  );
};

export default UserFilters;
