import React from "react";

const UserFilters = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="flex w-full min-w-0 items-center gap-2 sm:w-auto">
      <div className="relative min-w-0 flex-1 sm:flex-none">
        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input placeholder="Search users, sellers..." className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:w-72 sm:pr-4"
          onChange={(e) => onSearchChange(e.target.value)}
          value={searchTerm}
        />
      </div>
      <button className="border border-gray-300 hover:bg-gray-50 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors">Filter</button>
    </div>
  );
};

export default UserFilters;
