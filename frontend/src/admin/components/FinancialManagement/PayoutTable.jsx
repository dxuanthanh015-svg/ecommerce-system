import React from "react";

const PayoutTable = ({ payouts = [] }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'approved': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (!payouts || payouts.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-semibold text-gray-900">Payout Requests</div>
          <div className="text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full">Last 7 Days</div>
        </div>
        <div className="text-sm text-gray-500 py-8 text-center">No payout requests</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-semibold text-gray-900">Payout Requests</div>
        <div className="text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full">Last 7 Days</div>
      </div>
      <table className="w-full text-sm">
        <thead className="text-xs text-gray-500 bg-gray-50 font-semibold uppercase tracking-wider">
          <tr>
            <th className="p-4 w-12"><input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" /></th>
            <th className="p-4 text-left">Seller Name</th>
            <th className="p-4 text-left">Requested Amount</th>
            <th className="p-4 text-left">Bank Details</th>
            <th className="p-4 text-left">Request Date</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {payouts.map((payout) => (
            <tr key={payout.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="p-4"><input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" /></td>
              <td className="p-4">
                <div className="font-semibold text-gray-900">{payout.name}</div>
                <div className="text-xs text-gray-500">ID: {payout.vendorId}</div>
              </td>
              <td className="p-4 font-medium text-gray-900">{payout.amount}</td>
              <td className="p-4 text-gray-600">{payout.bank}</td>
              <td className="p-4 text-gray-600">{payout.date}</td>
              <td className="p-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(payout.status)}`}>
                  {payout.status}
                </span>
              </td>
              <td className="p-4 text-right">
                <button className="px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-medium transition-colors mr-2">Approve</button>
                <button className="px-3 py-1.5 border border-gray-300 hover:bg-gray-50 rounded-lg text-xs font-medium text-gray-700 transition-colors">Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PayoutTable;
