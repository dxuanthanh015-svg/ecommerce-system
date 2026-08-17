import React from "react";
import PercentRoundedIcon from "@mui/icons-material/PercentRounded";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import {
  getPromotionStatusClasses,
} from "./promotions.utils";

const typeIconMap = {
  percentage: PercentRoundedIcon,
  shipping: LocalShippingOutlinedIcon,
  amount: AttachMoneyRoundedIcon,
};

const PromotionCampaignListItem = ({ promotion, isSelected, onSelect }) => {
  const Icon = typeIconMap[promotion.type] || PercentRoundedIcon;

  return (
    <button
      type="button"
      onClick={() => onSelect(promotion.id)}
      className={`grid w-full grid-cols-[64px_minmax(0,1fr)_110px_100px_48px] items-center gap-3 border-t border-slate-100 px-5 py-3 text-left transition ${
        isSelected
          ? "bg-indigo-50/50"
          : "bg-white hover:bg-slate-50"
      }`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-indigo-50 text-indigo-700">
        <Icon sx={{ fontSize: 22 }} />
      </div>

      <div className="min-w-0">
        <p className="truncate text-[30px] leading-8 font-bold tracking-tight text-slate-900">
          {promotion.code}
        </p>
        <p className="truncate text-sm text-slate-500">{promotion.description}</p>
      </div>

      <div className="text-left text-sm text-slate-700">
        <p className="font-semibold">{promotion.usageCount} Uses</p>
        <p className="text-slate-500">{promotion.scheduleLabel}</p>
      </div>

      <div>
        <span
          className={`inline-flex rounded-md px-3 py-1 text-xs font-semibold ${getPromotionStatusClasses(
            promotion.status,
          )}`}
        >
          {promotion.status}
        </span>
      </div>

      <div className="flex justify-end text-slate-400">
        <MoreVertRoundedIcon sx={{ fontSize: 20 }} />
      </div>
    </button>
  );
};

export default PromotionCampaignListItem;
