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
      className={`grid w-full grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-2 border-t border-slate-100 px-3 py-3 text-left transition sm:grid-cols-[64px_minmax(0,1fr)_110px_100px_48px] sm:gap-3 sm:px-5 ${
        isSelected
          ? "bg-indigo-50/50"
          : "bg-white hover:bg-slate-50"
      }`}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-indigo-50 text-indigo-700 sm:h-12 sm:w-12">
        <Icon sx={{ fontSize: 22 }} />
      </div>

      <div className="min-w-0">
        <p className="truncate text-xl font-bold leading-7 tracking-tight text-slate-900 sm:text-[30px] sm:leading-8">
          {promotion.code}
        </p>
        <p className="truncate text-sm text-slate-500">{promotion.description}</p>
      </div>

      <div className="col-span-2 col-start-1 row-start-2 min-w-0 text-left text-xs text-slate-700 sm:col-span-1 sm:col-start-auto sm:row-start-auto sm:text-sm">
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

      <div className="col-start-3 row-start-1 flex justify-end text-slate-400 sm:col-auto sm:row-auto">
        <MoreVertRoundedIcon sx={{ fontSize: 20 }} />
      </div>
    </button>
  );
};

export default PromotionCampaignListItem;
