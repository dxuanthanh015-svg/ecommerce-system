import React from "react";

const SellerRow = ({ seller }) => {
  return (
    <tr className="hover:bg-white/50">
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-gray-100 flex items-center justify-center text-sm font-bold">{seller.initials}</div>
          <div>
            <div className="font-semibold text-gray-900">{seller.name}</div>
            <div className="text-xs text-gray-500">{seller.description}</div>
          </div>
        </div>
      </td>
      <td className="py-4 px-4 text-gray-600">{seller.owner}</td>
      <td className="py-4 px-4 text-gray-600">{seller.gmv}</td>
      <td className="py-4 px-4">
        <span className={`px-2 py-1 rounded text-xs ${seller.statusClass}`}>{seller.status}</span>
      </td>
      <td className="py-4 px-4 text-gray-600">{seller.joined}</td>
      <td className="py-4 px-4 text-right">
        <button className="text-gray-500 mr-2">✎</button>
        <button className="text-gray-500">⋯</button>
      </td>
    </tr>
  );
};

export default SellerRow;
