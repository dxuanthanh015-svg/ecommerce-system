import React from "react";

const PayoutTable = ({ payouts = [] }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-semibold">Payout Requests</div>
        <div className="text-xs text-gray-500">Last 7 Days</div>
      </div>
      <table className="w-full text-sm">
        <thead className="text-xs text-gray-500 uppercase">
          <tr>
            <th className="p-3"><input type="checkbox" /></th>
            <th className="p-3 text-left">Seller Name</th>
            <th className="p-3 text-left">Requested Amount</th>
            <th className="p-3 text-left">Bank Details</th>
            <th className="p-3 text-left">Request Date</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {payouts.map((payout) => (
            <tr key={payout.id} className="border-t">
              <td className="p-3"><input type="checkbox" /></td>
              <td className="p-3">
                <div className="font-semibold">{payout.name}</div>
                <div className="text-xs text-gray-500">ID: {payout.vendorId}</div>
              </td>
              <td className="p-3">{payout.amount}</td>
              <td className="p-3">{payout.bank}</td>
              <td className="p-3">{payout.date}</td>
              <td className="p-3">{payout.status}</td>
              <td className="p-3 text-right">
                <button className="px-3 py-1 bg-black text-white rounded text-xs mr-2">Approve</button>
                <button className="px-3 py-1 border rounded text-xs">Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PayoutTable;
