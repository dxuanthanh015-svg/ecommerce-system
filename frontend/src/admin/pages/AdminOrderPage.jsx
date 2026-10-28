import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { orderService } from "../../services/orderService";
import { formatVnd } from "../../utils/currency";

const AdminOrderPage = () => {
  const [search, setSearch] = useState("");
  const { data: orders = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["adminOrders"],
    queryFn: () => orderService.fetchOrders(),
    staleTime: 30_000,
  });

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return orders;
    return orders.filter((order) =>
      [order.orderCode, order.orderId, order.customerName, order.customerEmail]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [orders, search]);

  if (isLoading) return <div className="p-8 text-center text-gray-500">Đang tải đơn hàng...</div>;
  if (isError) {
    return <div className="p-8 text-center text-rose-600">Không tải được đơn hàng. <button onClick={() => refetch()} className="underline">Thử lại</button></div>;
  }

  return (
    <section className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        <p className="mt-1 text-sm text-gray-500">Danh sách đơn hàng toàn hệ thống.</p>
      </header>
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Tìm mã đơn, tên hoặc email khách hàng"
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 sm:max-w-md"
        />
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Mã đơn</th>
                <th className="px-4 py-3">Khách hàng</th>
                <th className="px-4 py-3">Ngày tạo</th>
                <th className="px-4 py-3">Thanh toán</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3 text-right">Tổng tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <tr key={order.id || order.orderCode || order.orderId}>
                  <td className="px-4 py-3 font-semibold text-gray-900">{order.orderCode || order.orderId || order.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-800">{order.customerName || order.recipientName || "Khách hàng"}</div>
                    <div className="text-xs text-gray-500">{order.customerEmail || "—"}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{order.createdAt ? new Date(order.createdAt).toLocaleString("vi-VN") : "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{order.paymentStatus || order.paymentMethod || "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{order.orderStatus || order.status || "—"}</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">{formatVnd(order.totalAmount || order.total || 0)}</td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-500">Không có đơn hàng phù hợp.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default AdminOrderPage;
