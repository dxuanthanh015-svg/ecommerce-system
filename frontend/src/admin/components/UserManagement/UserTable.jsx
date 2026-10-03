import React, { useState } from "react";
import UserRow from "./UserRow";

const UserTable = ({ users, totalCount = users.length, calculateRFMScore, ordersData }) => {
  const [selectedIds, setSelectedIds] = useState([]);

  const toggleSelect = (id, checked) => {
    setSelectedIds((prev) => {
      if (checked) return [...prev, id];
      return prev.filter((x) => x !== id);
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">Showing 1-10 of {totalCount.toLocaleString()}</div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 hover:bg-gray-50 rounded-lg text-sm font-medium text-gray-700 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>
          </div>
        </div>
      </div>
      <table className="w-full table-auto">
        <thead className="text-xs text-gray-500 bg-gray-50 font-semibold uppercase tracking-wider">
          <tr>
            <th className="p-4 w-12"><input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" onChange={(e) => { const checked = e.target.checked; setSelectedIds(checked ? users.map(u => u.id) : []); }} /></th>
            <th className="p-4 text-left">Name / Email</th>
            <th className="p-4 text-left">Role</th>
            <th className="p-4 text-left">Segment</th>
            <th className="p-4 text-left">Last Order Date</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <UserRow key={user.id} user={user} onToggleSelect={toggleSelect} selected={selectedIds.includes(user.id)} calculateRFMScore={calculateRFMScore} ordersData={ordersData} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
