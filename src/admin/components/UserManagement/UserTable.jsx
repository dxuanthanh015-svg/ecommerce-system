import React, { useState } from "react";
import UserRow from "./UserRow";
import { DEFAULT_USERS } from "./userManagement.data";

const UserTable = ({ users = DEFAULT_USERS, totalCount = users.length }) => {
  const [selectedIds, setSelectedIds] = useState([]);

  const toggleSelect = (id, checked) => {
    setSelectedIds((prev) => {
      if (checked) return [...prev, id];
      return prev.filter((x) => x !== id);
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">Showing 1-10 of {totalCount.toLocaleString()}</div>
          <div className="flex items-center gap-2">
            <button className="text-sm text-gray-600">Export</button>
          </div>
        </div>
      </div>
      <table className="w-full table-auto">
        <thead className="text-xs text-gray-500 bg-gray-50">
          <tr>
            <th className="p-3 w-12"><input type="checkbox" onChange={(e)=>{ const checked=e.target.checked; setSelectedIds(checked?users.map(u=>u.id):[]);}} /></th>
            <th className="p-3 text-left">Name / Email</th>
            <th className="p-3 text-left">Role</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Last Login</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <UserRow key={user.id} user={user} onToggleSelect={toggleSelect} selected={selectedIds.includes(user.id)} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
