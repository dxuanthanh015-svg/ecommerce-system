import React from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { getProductInventoryStatus } from "./productManagement.utils";

const ProductTableRow = ({
  product,
  onToggleVisibility,
  onEdit,
  onDelete,
  onView
}) => {
  const {
    id,
    title,
    sku,
    category,
    price,
    stockCount = 0,
    isVisible = true,
    imageUrl
  } = product;
  const statusBadge = getProductInventoryStatus(stockCount);

  return (
    <tr className="hover:bg-gray-50/60 transition-colors border-b border-gray-50 font-sans">
      {/* Product Image & Info */}
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <img
            src={imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200&auto=format&fit=crop"}
            alt={title}
            className="w-12 h-12 object-cover rounded-xl border border-gray-100 bg-gray-50 shrink-0"
          />
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-1">
              {title}
            </h4>
            <p className="text-[11px] font-medium text-gray-400">
              SKU: {sku || `SKU-${id}`}
            </p>
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="py-4 px-6 text-xs font-medium text-gray-600">
        {category}
      </td>

      {/* Price */}
      <td className="py-4 px-6 text-xs sm:text-sm font-bold text-gray-900">
        ${typeof price === "number" ? price.toFixed(2) : price}
      </td>

      <td className="py-4 px-6">
        <span className={statusBadge.badgeClassName}>{statusBadge.label}</span>
      </td>

      <td className="py-4 px-6">
        <button
          type="button"
          onClick={() => onToggleVisibility && onToggleVisibility(id)}
          className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 cursor-pointer ${
            isVisible ? "bg-indigo-600" : "bg-gray-200"
          }`}
          aria-label="Toggle product visibility"
        >
          <div
            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
              isVisible ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </td>

      <td className="py-4 px-6 text-right">
        <div className="flex items-center justify-end gap-2 text-gray-400">
          <button
            type="button"
            onClick={() => onView && onView(id)}
            className="p-1.5 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
            title="View Details"
          >
            <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
          </button>
          <button
            type="button"
            onClick={() => onEdit && onEdit(id)}
            className="p-1.5 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
            title="Edit Product"
          >
            <EditOutlinedIcon sx={{ fontSize: 18 }} />
          </button>
          <button
            type="button"
            onClick={() => onDelete && onDelete(id)}
            className="p-1.5 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Delete Product"
          >
            <DeleteOutlineOutlinedIcon sx={{ fontSize: 18 }} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ProductTableRow;
