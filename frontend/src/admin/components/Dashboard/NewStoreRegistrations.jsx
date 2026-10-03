import React, { useEffect, useState } from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';

const NewStoreRegistrations = ({ items = [] }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  // Lọc theo từ khóa tìm kiếm

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const filteredStores = items.filter((store) => {
    const term = search.toLowerCase().trim();
    if (!term) return true;
    const name = (store.name || store.storeName || "").toLowerCase();
    const owner = (store.owner || store.ownerName || "").toLowerCase();
    const email = (store.email || store.ownerEmail || "").toLowerCase();
    return name.includes(term) || owner.includes(term) || email.includes(term);
  });

  const item = filteredStores.length;
  const itemPerPage = 10;
  const pageNumber = Math.ceil(item / itemPerPage);
  const currentItem = filteredStores.slice((page - 1) * itemPerPage, page * itemPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const renderBadge = (status) => {
    const s = (status || "PENDING").toUpperCase();
    if (s.includes("PENDING")) {
      return (
        <span className="bg-[#fef3c7] text-[#92400e] text-[10px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">
          PENDING REVIEW
        </span>
      );
    }
    if (s === "APPROVED" || s === "ACTIVE") {
      return (
        <span className="bg-[#dcfce7] text-[#15803d] text-[10px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">
          APPROVED
        </span>
      );
    }
    return (
      <span className="bg-[#fee2e2] text-[#b91c1c] text-[10px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">
        {s}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-2xs overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 sm:p-5 flex items-center justify-between">
        <h4 className="text-base font-bold text-gray-900 tracking-tight">New Store Registrations</h4>

        <div className="flex items-center gap-2.5">
          {/* Search Input */}
          <div className="relative flex items-center">
            <svg
              className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search stores..."
              className="border border-gray-200 rounded-md pl-8 pr-3 py-1.5 text-xs text-gray-800 placeholder-gray-400 w-48 sm:w-56 focus:outline-none focus:border-gray-400"
            />
          </div>

          {/* Filter button */}
          <button
            type="button"
            className="text-gray-500 hover:text-gray-800 p-1.5 rounded transition-colors"
            title="Filter"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h18M6 10h12m-9 6h6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider border-y border-gray-200 bg-white">
              <th className="py-3 px-5">Store Name</th>
              <th className="py-3 px-5">Owner</th>
              <th className="py-3 px-5">Region / Address</th>
              <th className="py-3 px-5">Status</th>
              <th className="py-3 px-5">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredStores.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-gray-400 text-xs">
                  Chưa có cửa hàng nào đăng ký mới.
                </td>
              </tr>
            ) : (
              currentItem.map((store, idx) => (
                <tr key={store.id || store._id || idx} className="hover:bg-gray-50/60 transition-colors">
                  {/* Store Name + Thumbnail */}
                  <td className="py-3 px-5 font-semibold text-gray-900 flex items-center gap-3">
                    <div className="w-9 h-9 rounded border border-gray-200 bg-gray-50 overflow-hidden shrink-0 flex items-center justify-center">
                      {store.imageUrl ? (
                        <img src={store.imageUrl} alt={store.name || store.storeName} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs font-bold text-gray-400">🛍️</span>
                      )}
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm font-semibold text-gray-900 block">
                        {store.name || store.storeName || "Gian hàng mới"}
                      </span>
                      {store.email && (
                        <span className="text-[11px] text-gray-400 block">{store.email}</span>
                      )}
                    </div>
                  </td>

                  {/* Owner */}
                  <td className="py-3 px-5 text-xs sm:text-sm text-gray-700">
                    {store.owner || store.ownerName || "Chưa có"}
                  </td>

                  {/* Region */}
                  <td className="py-3 px-5 text-xs sm:text-sm text-gray-700">
                    {store.address || store.region || "Việt Nam"}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-5">
                    {renderBadge(store.status)}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-5 text-xs text-gray-400">
                    {/* Actions column */}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer Pagination */}
      <div className="p-3.5 sm:p-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
        <div>
          Showing {filteredStores.length > 0 ? ((page - 1) * itemPerPage + 1) : 0} - {page * itemPerPage > item ? item : page * itemPerPage} of {item} registrations
        </div>

        <div className="flex items-center justify-center">
          {pageNumber > 1 && (
            <Pagination
              count={pageNumber}
              page={page}
              onChange={handleChangePage}
              size="small"
              renderItem={(item) => (
                <PaginationItem
                  slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                  {...item}
                />
              )}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default NewStoreRegistrations;
