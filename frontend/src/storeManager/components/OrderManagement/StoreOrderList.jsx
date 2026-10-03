import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import OrderTableFilter from "./OrderTableFilter";
import OrderTableRow from "./OrderTableRow";
import OrderPagination from "./OrderPagination";
import StoreOrderDetailModal from "./StoreOrderDetailModal";
import { useCurrentStore } from "../../../hooks/useStoreQuery";
import { useStoreOrders, useUpdateOrderStatus } from "../../../hooks/useOrderQuery";
import { sortOrdersByNewest } from "../../../services/orderService";

const StoreOrderList = ({
  onConfirmOrder,
  onShipOrder,
  onCancelOrder
}) => {
  const { data: currentStore } = useCurrentStore();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { data: rawOrders = [], isLoading: loading } = useStoreOrders(currentStore?.id);
  const { mutate: updateStatusMutate, isPending: isUpdatingStatus, variables: updatingVars } = useUpdateOrderStatus();

  // Map to table rows format with full raw order preserved, sorted by newest first
  const orders = useMemo(() => {
    const mapped = rawOrders.map((o) => ({
      ...o,
      orderId: o.orderId,
      customerName: o.customer || o.customerName || o.shippingAddress?.fullName || "Customer",
      customerEmail: o.customerEmail || o.shippingAddress?.email || "customer@example.com",
      date: o.formattedDate || (o.date ? new Date(o.date).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "Today"),
      totalAmount: Number(o.totalAmount) || Number(o.total) || 0,
      paymentStatus: o.paymentMethod ? "Paid" : "Paid",
      orderStatus: o.status || "Pending",
    }));
    return sortOrdersByNewest(mapped);
  }, [rawOrders]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchParam, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParam.get("page") || "1", 10);

  useEffect(() => {
    setSearchParams({ page: 1 });
  }, [searchTerm, selectedStatus]);

  const handleStatusChange = (orderId, newStatus) => {
    if (isUpdatingStatus) return;
    updateStatusMutate({ orderId, status: newStatus, storeId: currentStore?.id });
    if (selectedOrder && selectedOrder.orderId === orderId) {
      setSelectedOrder((prev) => prev ? { ...prev, status: newStatus, orderStatus: newStatus } : null);
    }
  };

  // Confirm Order Handler
  const handleConfirm = (id) => {
    handleStatusChange(id, "Processing");
    if (onConfirmOrder) onConfirmOrder(id);
  };

  // Ship Order Handler
  const handleShip = (id) => {
    handleStatusChange(id, "Shipped");
    if (onShipOrder) onShipOrder(id);
  };

  // Deliver Order Handler
  const handleDeliver = (id) => {
    handleStatusChange(id, "Delivered");
  };

  // Cancel Order Handler
  const handleCancel = (id) => {
    if (window.confirm("Are you sure you want to cancel this order? Item inventory will be restored.")) {
      handleStatusChange(id, "Cancelled");
      if (onCancelOrder) onCancelOrder(id);
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
  const page = Math.max(1, Math.ceil(filteredOrders.length / orderRowPerPage));
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
            Review, process, and track customer shipments in real-time.
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
                <th className="py-4 px-6">STATUS</th>
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
                    onDeliverOrder={handleDeliver}
                    onCancelOrder={handleCancel}
                    onViewOrder={(o) => setSelectedOrder(o)}
                    isUpdating={isUpdatingStatus}
                    updatingOrderId={updatingVars?.orderId}
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
          showingFrom={currentPage > 1 ? (currentPage - 1) * orderRowPerPage + 1 : (filteredOrders.length > 0 ? 1 : 0)}
          showingTo={Math.min(currentPage * orderRowPerPage, filteredOrders.length)}
          totalEntries={filteredOrders.length}
          onPageChange={(event, newPage) => setSearchParams({ page: newPage })}
        />
      </div>

      {/* Order Detail Modal */}
      <StoreOrderDetailModal
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default StoreOrderList;
