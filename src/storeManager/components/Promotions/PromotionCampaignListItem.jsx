import React from "react";
import PercentRoundedIcon from "@mui/icons-material/PercentRounded";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { getPromotionStatusClasses } from "./promotions.utils";

const typeIconMap = {
  percentage: PercentRoundedIcon,
  shipping: LocalShippingOutlinedIcon,
  amount: AttachMoneyRoundedIcon,
};

const PromotionCampaignListItem = ({
  promotion,
  isSelected,
  onSelect,
  onDelete,
  onToggleStatus,
}) => {
  const Icon = typeIconMap[promotion.type] || PercentRoundedIcon;
  const currentUsage = promotion.usedCount !== undefined ? promotion.usedCount : (promotion.usageCount || 0);
  const limitLabel = promotion.usageLimit ? `${currentUsage}/${promotion.usageLimit}` : `${currentUsage} Uses`;

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Bạn có chắc muốn xóa voucher ${promotion.code}?`)) {
      onDelete?.(promotion.id);
    }
  };

  const handleStatusClick = (e) => {
    e.stopPropagation();
    if (!onToggleStatus) return;
    const nextStatus = promotion.status === "Active" ? "Expired" : "Active";
    onToggleStatus(promotion.id, nextStatus);
  };

  return (
    <div
      onClick={() => onSelect(promotion.id)}
      className={`grid w-full grid-cols-[52px_minmax(0,1fr)_120px_110px_48px] items-center gap-3 border-t border-slate-100 px-5 py-3.5 text-left transition cursor-pointer ${
        isSelected ? "bg-indigo-50/60" : "bg-white hover:bg-slate-50"
      }`}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 shrink-0">
        <Icon sx={{ fontSize: 22 }} />
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="truncate text-lg font-extrabold tracking-tight text-slate-900">
            {promotion.code}
          </p>
          {promotion.minOrderValue > 0 && (
            <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
              Min ${promotion.minOrderValue}
            </span>
          )}
        </div>
        <p className="truncate text-xs text-slate-500">{promotion.description}</p>
      </div>

      <div className="text-left text-xs text-slate-700">
        <p className="font-bold text-slate-900">{limitLabel}</p>
        <p className="text-[11px] text-slate-400">{promotion.scheduleLabel}</p>
      </div>

      <div>
        <button
          type="button"
          onClick={handleStatusClick}
          title="Click to toggle status"
          className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-bold transition hover:opacity-80 cursor-pointer ${getPromotionStatusClasses(
            promotion.status,
          )}`}
        >
          {promotion.status}
        </button>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleDelete}
          className="text-slate-400 hover:text-rose-600 transition p-1 rounded-lg hover:bg-rose-50 cursor-pointer"
          title="Delete voucher"
        >
          <DeleteOutlineRoundedIcon sx={{ fontSize: 20 }} />
        </button>
      </div>
    </div>
  );
};

export default PromotionCampaignListItem;
