import React from "react";

const getAvatarStyle = (initial, name = "") => {
  const upper = (initial || name.charAt(0) || "S").toUpperCase();
  switch (upper) {
    case "L":
      return "bg-[#dbeafe] text-[#1e40af]"; // Pastel Blue
    case "T":
      return "bg-[#ffedd5] text-[#9a3412]"; // Pastel Orange
    case "G":
      return "bg-[#f3f4f6] text-[#374151]"; // Pastel Gray
    case "S":
      return "bg-[#fee2e2] text-[#991b1b]"; // Pastel Red
    case "A":
    case "E":
      return "bg-[#e0e7ff] text-[#4338ca]"; // Pastel Indigo
    case "M":
    case "N":
      return "bg-[#ccfbf1] text-[#0f766e]"; // Pastel Teal
    default:
      return "bg-[#f3f4f6] text-[#374151]";
  }
};

const getStatusBadge = (status = "ACTIVE") => {
  const upper = status.toUpperCase();
  if (upper === "ACTIVE" || upper === "APPROVED") {
    return (
      <span className="bg-[#dcfce7] text-[#15803d] font-bold text-[10px] px-2 py-0.5 rounded tracking-wide uppercase inline-block">
        ACTIVE
      </span>
    );
  }
  if (upper.includes("PENDING")) {
    return (
      <span className="bg-[#fef08a] text-[#854d0e] font-bold text-[10px] px-2 py-0.5 rounded tracking-wide uppercase inline-block">
        PENDING APPROVAL
      </span>
    );
  }
  if (upper === "BLOCKED" || upper === "REJECTED") {
    return (
      <span className="bg-[#fee2e2] text-[#991b1b] font-bold text-[10px] px-2 py-0.5 rounded tracking-wide uppercase inline-block">
        BLOCKED
      </span>
    );
  }
  return (
    <span className="bg-gray-100 text-gray-700 font-bold text-[10px] px-2 py-0.5 rounded tracking-wide uppercase inline-block">
      {status}
    </span>
  );
};

const SellerRow = ({ seller, onReview, onEdit, onMore }) => {
  const initial = seller.initials || (seller.name ? seller.name.charAt(0).toUpperCase() : "S");
  const avatarClass = seller.avatarBgClass || getAvatarStyle(initial, seller.name);
  const isPending = (seller.status || "").toUpperCase().includes("PENDING");

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50/60 transition-colors text-xs">
      {/* 1. Store Name */}
      <td className="py-3.5 px-5">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 select-none ${avatarClass}`}
          >
            {initial}
          </div>
          <div className="min-w-0">
            <div className="font-bold text-gray-900 text-xs sm:text-sm tracking-tight truncate">
              {seller.name || seller.storeName || "Gian hàng mới"}
            </div>
            <div className="text-[11px] text-gray-400 mt-0.5 truncate">
              {seller.description || seller.category || "General Products"}
            </div>
          </div>
        </div>
      </td>

      {/* 2. Owner */}
      <td className="py-3.5 px-5 text-gray-800 font-medium text-xs">
        {seller.owner || seller.ownerName || "Chủ gian hàng"}
      </td>

      {/* 3. Total GMV */}
      <td className="py-3.5 px-5 text-gray-800 font-medium text-xs">
        {typeof seller.gmv === "number"
          ? `$${seller.gmv.toLocaleString()}`
          : seller.gmv || "$0"}
      </td>

      {/* 4. Status */}
      <td className="py-3.5 px-5">
        {getStatusBadge(seller.status)}
      </td>

      {/* 5. Joined Date */}
      <td className="py-3.5 px-5 text-gray-600 font-medium text-xs whitespace-nowrap">
        {seller.joined || seller.joinedDate || "Today"}
      </td>

      {/* 6. Actions */}
      <td className="py-3.5 px-5 text-right whitespace-nowrap">
        <div className="inline-flex items-center justify-end gap-3.5">
          {/* Review text button for Pending stores */}
          {isPending && (
            <button
              type="button"
              onClick={() => onReview && onReview(seller)}
              className="font-bold text-gray-900 text-xs hover:underline cursor-pointer"
            >
              Review
            </button>
          )}

          {/* Edit Pencil Icon */}
          <button
            type="button"
            title="Edit seller"
            onClick={() => onEdit && onEdit(seller)}
            className="text-gray-400 hover:text-gray-800 transition-colors cursor-pointer p-0.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>

          {/* More 3-Dots Icon */}
          <button
            type="button"
            title="More actions"
            onClick={() => onMore && onMore(seller)}
            className="text-gray-400 hover:text-gray-800 transition-colors cursor-pointer p-0.5"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default SellerRow;
