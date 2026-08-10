import React from "react";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import { formatCompactValue, getMetricAccentClasses } from "./promotions.utils";

const iconMap = {
  voucher: LocalOfferOutlinedIcon,
  usage: Inventory2OutlinedIcon,
  impact: TrendingUpRoundedIcon,
};

const PromotionStatCard = ({ metric }) => {
  const Icon = iconMap[metric.iconKey] || LocalOfferOutlinedIcon;

  return (
    <article className="rounded-2xl border border-[#e5e7f2] bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold leading-4 text-slate-500">
            {metric.label}
          </p>
          <h3 className="mt-3 text-[44px] leading-none font-bold tracking-tight text-slate-900">
            {formatCompactValue(metric.value, metric.valueType)}
          </h3>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${getMetricAccentClasses(metric.accent)}`}
        >
          <Icon sx={{ fontSize: 20 }} />
        </div>
      </div>
    </article>
  );
};

export default PromotionStatCard;
