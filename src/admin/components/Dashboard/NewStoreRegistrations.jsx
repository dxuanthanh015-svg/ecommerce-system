import React from "react";

const NewStoreRegistrations = ({ items = [] }) => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold text-gray-900">New Store Registrations</h4>
        <div className="flex items-center gap-2">
          <input placeholder="Search stores..." className="border border-gray-200 rounded-lg py-1 px-2 text-sm" />
          <button className="text-gray-500">⚙️</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-xs text-gray-400 uppercase tracking-widest">
              <th className="py-3 px-4">Store Name</th>
              <th className="py-3 px-4">Owner</th>
              <th className="py-3 px-4">Region</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map((it, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="py-3 px-4 font-bold text-gray-900">{it.name}</td>
                <td className="py-3 px-4 text-gray-600">{it.owner}</td>
                <td className="py-3 px-4 text-gray-600">{it.region}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs ${it.statusClass || 'bg-yellow-100 text-yellow-800'}`}>{it.status}</span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button className="text-xs text-indigo-600 font-bold">Review</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-gray-400 mt-2">Showing {items.length} registrations</div>
    </div>
  );
};

export default NewStoreRegistrations;
