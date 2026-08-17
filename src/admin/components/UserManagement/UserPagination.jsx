import React from "react";

const UserPagination = ({ page = 1, totalPages = 10, onPageChange = () => {} }) => {
  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1 + Math.max(0, page - 3));
  return (
    <div className="flex items-center justify-end p-3">
      <div className="text-sm text-gray-600 mr-3">Rows per page:</div>
      <select className="border p-1 text-sm mr-4">
        <option>10</option>
        <option>25</option>
        <option>50</option>
      </select>
      <nav className="flex items-center gap-2">
        {pages.map((p) => (
          <button key={p} onClick={() => onPageChange(p)} className={`px-3 py-1 rounded ${p === page ? 'bg-black text-white' : 'text-gray-600'}`}>{p}</button>
        ))}
      </nav>
    </div>
  );
};

export default UserPagination;
