import React from "react";
import SellerRow from "./SellerRow";

const mockSellers = [
  { initials: 'L', name: 'Luxe Apparel', description: 'Fashion & Accessories', owner: 'Sarah Jenkins', gmv: '$1,245,000', status: 'ACTIVE', statusClass: 'bg-emerald-100 text-emerald-800', joined: 'Oct 12, 2021' },
  { initials: 'T', name: 'TechHaven', description: 'Electronics', owner: 'Marcus Chen', gmv: '$3,890,200', status: 'ACTIVE', statusClass: 'bg-emerald-100 text-emerald-800', joined: 'Mar 04, 2022' },
  { initials: 'G', name: 'Green Roots', description: 'Home & Garden', owner: 'Elena Rossi', gmv: '$0', status: 'PENDING APPROVAL', statusClass: 'bg-yellow-100 text-yellow-800', joined: 'Today' },
  { initials: 'S', name: 'Swift Gadgets', description: 'Electronics', owner: 'David Kim', gmv: '$45,000', status: 'BLOCKED', statusClass: 'bg-rose-100 text-rose-800', joined: 'Jan 15, 2023' }
];

const SellerTable = ({ sellers = mockSellers }) => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-xs text-gray-400 uppercase tracking-widest">
              <th className="py-3 px-4">Store Name</th>
              <th className="py-3 px-4">Owner</th>
              <th className="py-3 px-4">Total GMV</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Joined Date</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {sellers.map((s, idx) => (
              <SellerRow key={idx} seller={s} />
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-xs text-gray-400 mt-3">Showing 1-4 of 128 stores</div>
    </div>
  );
};

export default SellerTable;
