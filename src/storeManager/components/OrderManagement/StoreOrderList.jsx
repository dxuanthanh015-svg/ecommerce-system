import React, { useState } from "react";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import AddIcon from "@mui/icons-material/Add";
import OrderTableFilter from "./OrderTableFilter";
import OrderTableRow from "./OrderTableRow";
import OrderPagination from "./OrderPagination";


import { getStoreOrderRevenue, updateStoreOrderStatus } from "../../../customer/utils/orderInventoryUtils";
import { useSearchParams } from "react-router-dom";

const StoreOrderList = ({
  onConfirmOrder,
  onShipOrder,
  onCancelOrder
}) => {
  const currentStore = JSON.parse(localStorage.getItem("currentStore")) || {};

  const [orders, setOrders] = useState(() => {
    const revenueData = getStoreOrderRevenue(currentStore?.id);
    if (revenueData && revenueData.orders && revenueData.orders.length > 0) {
      return revenueData.orders.map((o) => ({
        orderId: o.orderId,
        customerName: o.customer || o.customerName || "Customer",
        customerEmail: o.customerEmail || "customer@example.com",
        date: o.formattedDate || (o.date ? new Date(o.date).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "Today"),
        totalAmount: Number(o.totalAmount) || Number(o.total) || 0,
        paymentStatus: o.paymentMethod ? "Paid" : "Paid",
        orderStatus: o.status || "Pending",
      }));
    }
    return defaultOrders;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchParam, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParam.get("page") || "1", 10);

  // Confirm Order Handler
  const handleConfirm = (id) => {
    if (currentStore.id) {
      updateStoreOrderStatus(currentStore.id, id, "Processing");
    }
    if (onConfirmOrder) {
      onConfirmOrder(id);
    } else {
      setOrders((prev) =>
        prev.map((o) => (o.orderId === id ? { ...o, orderStatus: "Processing" } : o))
      );
    }
  };

  // Ship Order Handler
  const handleShip = (id) => {
    if (currentStore.id) {
      updateStoreOrderStatus(currentStore.id, id, "Shipped");
    }
    if (onShipOrder) {
      onShipOrder(id);
    } else {
      setOrders((prev) =>
        prev.map((o) => (o.orderId === id ? { ...o, orderStatus: "Shipped" } : o))
      );
    }
  };

  // Cancel Order Handler
  const handleCancel = (id) => {
    if (currentStore.id) {
      updateStoreOrderStatus(currentStore.id, id, "Cancelled");
    }
    if (onCancelOrder) {
      onCancelOrder(id);
    } else {
      setOrders((prev) =>
        prev.map((o) => (o.orderId === id ? { ...o, orderStatus: "Cancelled" } : o))
      );
    }
  };

  // Filter Orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === "All" ||
      order.orderStatus.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const orderRowPerPage = 8;
  const page = Math.ceil(filteredOrders.length / orderRowPerPage);
  const currentPageData = filteredOrders.slice(
    (currentPage - 1) * orderRowPerPage,
    currentPage * orderRowPerPage
  );

  return (
    <div className="space-y-6 font-sans">
      {/* Title & Top Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Order Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Review and process recent customer orders.
          </p>
        </div>
      </div>

      {/* Filter & Search Sub-component */}
      <OrderTableFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50">
                <th className="py-4 px-6">ORDER ID</th>
                <th className="py-4 px-6">CUSTOMER NAME</th>
                <th className="py-4 px-6">DATE</th>
                <th className="py-4 px-6">TOTAL AMOUNT</th>
                <th className="py-4 px-6">PAYMENT STATUS</th>
                <th className="py-4 px-6 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentPageData.length > 0 ? (
                currentPageData.map((order) => (
                  <OrderTableRow
                    key={order.orderId}
                    order={order}
                    onConfirmOrder={handleConfirm}
                    onShipOrder={handleShip}
                    onCancelOrder={handleCancel}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500 font-medium text-xs">
                    No orders found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Sub-component */}
        <OrderPagination
          currentPage={currentPage}
          totalPages={page}
          showingFrom={currentPage > 1 ? (currentPage - 1) * orderRowPerPage + 1 : 1}
          showingTo={currentPage === page ? filteredOrders.length : currentPage * orderRowPerPage}
          totalEntries={filteredOrders.length}
          onPageChange={(event, newPage) => setSearchParams({ page: newPage })}
        />
      </div>

    </div>
  );
};

export default StoreOrderList;
