import React, { useState, useMemo } from "react";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);

const statusCapsuleStyles = {
  Completed: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  Reconciled: "bg-indigo-50 text-indigo-700 border border-indigo-100",
  Pending: "bg-amber-50 text-amber-700 border border-amber-100",
  Failed: "bg-rose-50 text-rose-700 border border-rose-100",
};

const TransferHistoryTable = ({
  title = "Transfer History",
  items = [],
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100/80 shadow-xs p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base sm:text-lg font-bold text-slate-900">{title}</h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-5 sm:-mx-6">
        <table className="w-full text-left border-collapse min-w-[640px]">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
              <th className="py-3 px-5 sm:px-6">Transfer ID</th>
              <th className="py-3 px-5 sm:px-6">Date</th>
              <th className="py-3 px-5 sm:px-6">Gross Amount</th>
              <th className="py-3 px-5 sm:px-6">Fees (5%)</th>
              <th className="py-3 px-5 sm:px-6">Net Transferred</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {items.length > 0 ? (
              items.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  <td className="py-3.5 px-5 sm:px-6 text-xs sm:text-sm font-bold text-slate-900">
                    {item.id}
                  </td>
                  <td className="py-3.5 px-5 sm:px-6 text-xs sm:text-sm text-slate-500 font-medium">
                    {item.date}
                  </td>
                  <td className="py-3.5 px-5 sm:px-6 text-xs sm:text-sm font-semibold text-slate-800">
                    {formatCurrency(item.grossAmount)}
                  </td>
                  <td className="py-3.5 px-5 sm:px-6 text-xs sm:text-sm font-bold text-rose-500">
                    -{formatCurrency(item.feeAmount)}
                  </td>
                  <td className="py-3.5 px-5 sm:px-6 text-xs sm:text-sm font-bold text-slate-900">
                    {formatCurrency(item.netTransferred)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="py-10 text-center text-slate-400 text-xs sm:text-sm"
                >
                  No transfer records match the filter.
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
