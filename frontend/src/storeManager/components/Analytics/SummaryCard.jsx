import React from "react";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import TrendingDownOutlinedIcon from "@mui/icons-material/TrendingDownOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import PercentOutlinedIcon from "@mui/icons-material/PercentOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";

const iconMap = {
  revenue: PaymentsOutlinedIcon,
  fees: PercentOutlinedIcon,
  net: AccountBalanceOutlinedIcon,
};

const accentStyles = {
  purple: {
    bg: "bg-purple-50",
    text: "text-purple-600",
    border: "border-purple-100",
  },
  rose: {
    bg: "bg-rose-50",
    text: "text-rose-500",
    border: "border-rose-100",
  },
  emerald: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-100",
  },
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);

const SummaryCard = ({
  label,
  value,
  valueType = "currency",
  delta,
  note,
  trend = "positive",
  iconKey = "revenue",
  accent = "purple",
}) => {
  const IconComponent = iconMap[iconKey] || PaymentsOutlinedIcon;
  const styles = accentStyles[accent] || accentStyles.purple;
  const displayValue = valueType === "currency" ? formatCurrency(value) : value;

  return (
    <div className="bg-white rounded-2xl border border-slate-100/80 shadow-xs p-5 sm:p-6 flex items-start justify-between gap-4 transition-all hover:shadow-sm">
      <div className="min-w-0">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
          {label}
        </p>
        <p className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight leading-tight">
          {displayValue}
        </p>

        <div className="flex items-center gap-1.5 mt-3 flex-wrap">
          {trend === "positive" && (
            <TrendingUpOutlinedIcon sx={{ fontSize: 16, color: "#10b981" }} />
          )}
          {trend === "negative" && (
            <TrendingDownOutlinedIcon sx={{ fontSize: 16, color: "#ef4444" }} />
          )}
          {delta && (
            <span
              className={`text-xs font-bold ${trend === "positive"
                ? "text-emerald-600"
                : accent === "rose"
                  ? "text-rose-500"
                  : "text-slate-600"
                }`}
            >
              {delta}
            </span>
          )}
          {note && (
            <span
              className={`text-xs ${accent === "rose" && trend !== "positive"
                ? "text-rose-500 font-semibold"
                : "text-slate-400 font-medium"
                }`}
            >
              {note}
            </span>
          )}
        </div>
      </div>

      <div
        className={`${styles.bg} rounded-xl p-3 shrink-0 flex items-center justify-center`}
      >
        <IconComponent className={styles.text} sx={{ fontSize: 24 }} />
      </div>
    </div>
  );
};

export default SummaryCard;
