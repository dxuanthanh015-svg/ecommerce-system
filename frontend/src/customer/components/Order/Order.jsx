import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import OrderCard from "./OrderCard";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import { useCurrentUser } from "../../../hooks/useAuthQuery";
import { useUserOrders, useUpdateOrderStatus } from "../../../hooks/useOrderQuery";
import { sortOrdersByNewest } from "../../../services/orderService";
import toast from "react-hot-toast";

const Order = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const { data: orders = [], isLoading: isOrdersLoading } = useUserOrders(user?.email, { enabled: !isUserLoading });
  const { mutate: updateStatusMutate, isPending: isUpdatingStatus, variables: updatingVars } = useUpdateOrderStatus();
  const loading = isUserLoading || isOrdersLoading;

  const handleConfirmReceived = (orderId) => {
    updateStatusMutate(
      { orderId, status: "Delivered" },
      {
        onSuccess: () => {
          toast.success(`Đã xác nhận nhận hàng thành công cho đơn #${orderId}!`);
        },
        onError: () => {
          toast.error("Có lỗi xảy ra khi xác nhận đơn hàng!");
        },
      }
    );
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  useEffect(() => {
    setSearchParams({ page: 1 });
  }, [searchTerm, statusFilter]);

  const handleChangePage = (event, newPage) => {
    setSearchParams({ page: newPage });
  };

  const itemPerPage = 4;
  const filteredOrders = useMemo(() => {
    const sorted = sortOrdersByNewest(orders);
    return sorted.filter((order) => {
      const matchesSearch = (order.orderId || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredOrders.length / itemPerPage);
  const startIndex = (page - 1) * itemPerPage;
  const currentOrders = filteredOrders.slice(startIndex, startIndex + itemPerPage);

  return (
    <div className="bg-[#f8f9fc]/60 min-h-screen py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header & Controls Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-1">
              Your Orders
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Track, view details, and manage your past and recent purchases
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <SearchIcon
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                sx={{ fontSize: 18 }}
              />
              <input
                type="text"
                placeholder="Search by Order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-gray-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 rounded-xl pl-10 pr-4 py-2 text-xs text-gray-900 placeholder-gray-400 outline-none transition shadow-2xs"
              />
            </div>

            {/* Status Filter Dropdown */}
            <div className="relative w-full sm:w-40">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 rounded-xl px-4 py-2 pr-8 text-xs font-semibold text-gray-700 outline-none transition cursor-pointer shadow-2xs"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <KeyboardArrowDownIcon
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                sx={{ fontSize: 18 }}
              />
            </div>
          </div>
        </div>

        {/* Order Cards Stack */}
        {currentOrders.length > 0 ? (
          <div className="space-y-6">
            {currentOrders.map((order) => {
              const currentOrderId = order.orderId || order.id;
              const isConfirming = isUpdatingStatus && String(updatingVars?.orderId) === String(currentOrderId);
              return (
                <OrderCard
                  key={currentOrderId}
                  order={order}
                  onConfirmReceived={handleConfirmReceived}
                  isConfirming={isConfirming}
                />
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-2xs max-w-md mx-auto my-12">
            <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 font-bold text-xl">
              📦
            </div>
            <h3 className="text-lg font-extrabold text-gray-900 mb-2">No orders found</h3>
            <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
              {searchTerm || statusFilter !== "All"
                ? "No orders match your current filters. Try changing your search query."
                : "You haven't placed any orders yet. Start exploring our latest products!"}
            </p>
          </div>
        )}

        {/* Pagination Section */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-12">
            <Pagination
              count={totalPages}
              page={page}
              onChange={handleChangePage}
              renderItem={(item) => (
                <PaginationItem
                  slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                  {...item}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: '#4f46e5',
                      color: '#ffffff',
                      fontWeight: 'bold',
                      '&:hover': {
                        backgroundColor: '#4338ca',
                      },
                    },
                    borderRadius: '12px',
                    margin: '0 4px',
                    fontSize: '0.85rem',
                  }}
                />
              )}
            />
          </div>
        )}

      </div>
    </div>
  );
};

export default Order;
