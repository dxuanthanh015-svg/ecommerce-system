import React from "react";
import { formatVnd } from "../../../utils/currency";

const statusStyles = {
  COMPLETED: "text-emerald-600",
  PROCESSING: "text-blue-600",
  PENDING: "text-amber-600",
  REJECTED: "text-slate-600",
  FAILED: "text-red-600",
};

const TransferHistoryTable = ({ title, items = [] }) => (
  <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
    <h2 className="mb-5 text-lg font-bold text-gray-900">{title}</h2>
    <div className="-mx-6 overflow-x-auto">
      <table className="min-w-[700px] w-full border-collapse text-left">
        <thead><tr className="border-b border-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-400">
          <th className="px-6 py-3">Payout ID</th><th className="px-6 py-3">Date</th><th className="px-6 py-3">Store</th><th className="px-6 py-3">Amount</th><th className="px-6 py-3">Bank</th><th className="px-6 py-3">Status</th>
        </tr></thead>
        <tbody className="divide-y divide-gray-50">
          {items.length ? items.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50/50">
              <td className="px-6 py-4 text-sm font-semibold text-gray-800">{item.id}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{item.date ? new Date(item.date).toLocaleDateString("vi-VN") : "—"}</td>
              <td className="px-6 py-4 text-sm text-gray-700">{item.storeName || "—"}</td>
              <td className="px-6 py-4 text-sm font-semibold text-gray-800">{formatVnd(item.amount)}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{item.bankName || "—"}</td>
              <td className={`px-6 py-4 text-xs font-semibold ${statusStyles[item.status] || "text-gray-500"}`}>{item.status || "—"}</td>
            </tr>
          )) : <tr><td colSpan={6} className="py-12 text-center text-sm text-gray-400">Chưa có giao dịch chuyển khoản trong cơ sở dữ liệu.</td></tr>}
        </tbody>
      </table>
    </div>
  </section>
);

export default TransferHistoryTable;
