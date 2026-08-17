import React from "react";

const statusDot = (status) => {
  if (status === 'active') return <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2" />;
  if (status === 'suspended') return <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2" />;
  return <span className="inline-block w-2 h-2 rounded-full bg-yellow-400 mr-2" />;
};

const UserRow = ({ user, onToggleSelect = () => {}, selected = false }) => {
  return (
    <tr className={`text-sm ${selected ? 'bg-gray-50' : ''}`}>
      <td className="p-3">
        <input type="checkbox" checked={selected} onChange={(e) => onToggleSelect(user.id, e.target.checked)} />
      </td>
      <td className="p-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-700">{user.name.split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
          <div>
            <div className="font-semibold">{user.name}</div>
            <div className="text-xs text-gray-500">{user.email}</div>
          </div>
        </div>
      </td>
      <td className="p-3">{user.role}</td>
      <td className="p-3">{statusDot(user.status)}<span className="align-middle text-sm text-gray-700">{user.status}</span></td>
      <td className="p-3">{user.lastLogin}</td>
    </tr>
  );
};

export default UserRow;
