import React, { useState } from "react";
import OrderCard from "./OrderCard";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const mockOrders = [
  {
    orderId: "NX-8472-91",
    date: "Oct 24, 2024",
    status: "Delivered",
    total: 142.50,
    items: [
      { id: 101, imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop" },
      { id: 102, imageUrl: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=600&auto=format&fit=crop" }
    ],
    extraCount: 2
  },
  {
    orderId: "NX-8472-88",
    date: "Oct 28, 2024",
    status: "In Transit",
    total: 89.00,
    items: [
      { id: 103, imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=600&auto=format&fit=crop" }
    ],
    extraCount: 0
  },
  {
    orderId: "NX-8473-12",
    date: "Nov 01, 2024",
    status: "Processing",
    total: 210.75,
    items: [
      { id: 104, imageUrl: "https://images.unsplash.com/photo-1585336261026-8f5786372966?q=80&w=600&auto=format&fit=crop" },
      { id: 105, imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop" }
    ],
    extraCount: 0
  }
];

const Order = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [activePage, setActivePage] = useState(1);

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch = order.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
              Manage and track your recent purchases.
            </p>
          </div>

          {/* Controls: Search & Filter */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" sx={{ fontSize: 18 }} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Order ID"
                className="w-full bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl pl-9 pr-4 py-2.5 text-xs text-gray-900 placeholder-gray-400 shadow-2xs transition-all"
              />
            </div>

            {/* Status Filter Dropdown */}
            <div className="relative w-full sm:w-44">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-xs text-gray-700 shadow-2xs appearance-none cursor-pointer pr-8 font-medium"
              >
                <option value="All">All Statuses</option>
                <option value="Delivered">Delivered</option>
                <option value="In Transit">In Transit</option>
                <option value="Processing">Processing</option>
              </select>
              <KeyboardArrowDownIcon className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" sx={{ fontSize: 18 }} />
            </div>
          </div>
        </div>

        {/* Orders Grid (2 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <OrderCard key={order.orderId} order={order} />
            ))
          ) : (
            <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-2xs">
              <p className="text-gray-500 font-medium text-sm">No orders found matching your search.</p>
            </div>
          )}
        </div>

        {/* Pagination Bar */}
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setActivePage(Math.max(1, activePage - 1))}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 text-xs font-semibold cursor-pointer transition-colors"
          >
            &lt;
          </button>
          
          {[1, 2, 3].map((page) => (
            <button
              key={page}
              onClick={() => setActivePage(page)}
              className={`w-9 h-9 flex items-center justify-center rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activePage === page
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setActivePage(Math.min(3, activePage + 1))}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 text-xs font-semibold cursor-pointer transition-colors"
          >
            &gt;
          </button>
        </div>

      </div>
    </div>
  );
};

export default Order;
