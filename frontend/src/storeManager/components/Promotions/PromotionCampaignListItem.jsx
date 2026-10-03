import React from "react";
import toast from "react-hot-toast";
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
  isDeleting = false,
  isUpdating = false,
}) => {
  const Icon = typeIconMap[promotion.type] || PercentRoundedIcon;
  const currentUsage = promotion.usedCount !== undefined ? promotion.usedCount : (promotion.usageCount || 0);
  const limitLabel = promotion.usageLimit ? `${currentUsage}/${promotion.usageLimit}` : `${currentUsage} Uses`;

  const handleDelete = (e) => {
    e.stopPropagation();
    if (isDeleting || isUpdating) return;
    toast((t) => (
      <span>
        Xóa voucher <strong>{promotion.code}</strong>?
        <button onClick={() => { onDelete?.(promotion.id); toast.dismiss(t.id); }} style={{marginLeft:8,background:'#ef4444',color:'#fff',border:'none',borderRadius:6,padding:'2px 10px',cursor:'pointer',fontWeight:600}}>Xóa</button>
        <button onClick={() => toast.dismiss(t.id)} style={{marginLeft:6,background:'#e5e7eb',color:'#374151',border:'none',borderRadius:6,padding:'2px 10px',cursor:'pointer',fontWeight:600}}>Hủy</button>
      </span>
    ), { duration: 6000 });
  };

  const handleStatusClick = (e) => {
    e.stopPropagation();
    if (isUpdating || isDeleting || !onToggleStatus) return;
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
          disabled={isUpdating || isDeleting}
          onClick={handleStatusClick}
          title="Click to toggle status"
          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition hover:opacity-80 ${
            isUpdating || isDeleting ? "cursor-wait opacity-60" : "cursor-pointer"
          } ${getPromotionStatusClasses(promotion.status)}`}
        >
          {isUpdating && (
            <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />
          )}
          <span>{promotion.status}</span>
        </button>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          disabled={isDeleting || isUpdating}
          onClick={handleDelete}
          className={`p-1 rounded-lg transition ${
            isDeleting
              ? "text-rose-500 cursor-wait opacity-80"
              : "text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
          }`}
          title={isDeleting ? "Đang xóa..." : "Delete voucher"}
        >
          {isDeleting ? (
            <span className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin inline-block align-middle" />
          ) : (
            <DeleteOutlineRoundedIcon sx={{ fontSize: 20 }} />
          )}
        </button>
      </div>
    </div>
  );
};

export default PromotionCampaignListItem;
