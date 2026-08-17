import React from "react";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);

const statusStyles = {
  Completed: "text-emerald-600",
  Reconciled: "text-blue-600",
  Pending: "text-amber-600",
  Failed: "text-red-600",
};

const TransferHistoryTable = ({ title, items = [], filterLabel, onFilter }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        <button
          type="button"
          onClick={onFilter}
          className="flex items-center gap-1.5 text-xs font-semibold text-indigo-500 hover:text-indigo-700 transition-colors cursor-pointer"
        >
          {filterLabel}
          <FilterListOutlinedIcon sx={{ fontSize: 16 }} />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-6">
        <table className="w-full text-left border-collapse min-w-[640px]">
          <thead>
            <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <th className="py-3 px-6">Transfer ID</th>
              <th className="py-3 px-6">Date</th>
              <th className="py-3 px-6">Gross Amount</th>
              <th className="py-3 px-6">Fees (5%)</th>
              <th className="py-3 px-6">Net Transferred</th>
              <th className="py-3 px-6">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {items.length > 0 ? (
              items.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-4 px-6 text-sm font-semibold text-gray-800">
                    {item.id}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-500">
                    {item.date}
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-gray-800">
                    {formatCurrency(item.grossAmount)}
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-rose-500">
                    -{formatCurrency(item.feeAmount)}
                  </td>
                  <td className="py-4 px-6 text-sm font-semibold text-gray-800">
                    {formatCurrency(item.netTransferred)}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`text-xs font-semibold ${
                        statusStyles[item.status] || "text-gray-500"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="py-12 text-center text-gray-400 text-sm"
                >
                  No transfer records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransferHistoryTable;
