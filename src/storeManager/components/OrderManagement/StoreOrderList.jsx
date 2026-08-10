import React, { useState } from "react";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import AddIcon from "@mui/icons-material/Add";
import OrderTableFilter from "./OrderTableFilter";
import OrderTableRow from "./OrderTableRow";
import OrderPagination from "./OrderPagination";

// Default Reusable API Schema for demonstration
const defaultOrders = [
  {
    orderId: "#ORD-9021",
    customerName: "Emma Stone",
    customerEmail: "emma.s@example.com",
    date: "Oct 24, 2023 10:42 AM",
    totalAmount: 1249.00,
    paymentStatus: "Paid",
    orderStatus: "Pending"
  },
  {
    orderId: "#ORD-9020",
    customerName: "John Doe",
    customerEmail: "john.doe@example.com",
    date: "Oct 23, 2023 14:15 PM",
    totalAmount: 45.50,
    paymentStatus: "Unpaid",
    orderStatus: "Pending"
  },
  {
    orderId: "#ORD-9019",
    customerName: "Alice Wong",
    customerEmail: "alice.w@example.com",
    date: "Oct 22, 2023 09:30 AM",
    totalAmount: 320.00,
    paymentStatus: "Paid",
    orderStatus: "Packing"
  },
  {
    orderId: "#ORD-9018",
    customerName: "Michael Johnson",
    customerEmail: "mjohnson@example.com",
    date: "Oct 20, 2023 16:45 PM",
    totalAmount: 89.99,
    paymentStatus: "Paid",
    orderStatus: "Completed"
  }
];

const StoreOrderList = ({
  ordersList = defaultOrders,
  onExport,
  onCreateOrder,
  onConfirmOrder,
  onShipOrder,
  onCancelOrder
}) => {
  const [orders, setOrders] = useState(ordersList);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // Confirm Order Handler
  const handleConfirm = (id) => {
    if (onConfirmOrder) {
      onConfirmOrder(id);
    } else {
      setOrders((prev) =>
        prev.map((o) => (o.orderId === id ? { ...o, orderStatus: "Packing" } : o))
      );
    }
  };

  // Ship Order Handler
  const handleShip = (id) => {
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

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onExport}
            className="border border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-2xs flex items-center justify-center gap-1.5"
          >
            <FileDownloadOutlinedIcon sx={{ fontSize: 18 }} />
            <span>Export</span>
          </button>

          <button
            type="button"
            onClick={onCreateOrder}
            className="bg-[#5B21B6] hover:bg-purple-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5"
          >
            <AddIcon sx={{ fontSize: 18 }} />
            <span>Create Order</span>
          </button>
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
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
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
          totalPages={3}
          showingFrom={filteredOrders.length > 0 ? 1 : 0}
          showingTo={filteredOrders.length}
          totalEntries={24}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

    </div>
  );
};

export default StoreOrderList;
