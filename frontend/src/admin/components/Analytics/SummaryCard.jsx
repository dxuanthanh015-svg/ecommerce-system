import React from "react";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";

const iconMap = {
  revenue: BusinessCenterOutlinedIcon,
  fees: ReceiptLongOutlinedIcon,
  net: AccountBalanceWalletOutlinedIcon,
};

const accentStyles = {
  indigo: { bg: "bg-indigo-50", text: "text-indigo-500", delta: "text-indigo-500" },
  rose: { bg: "bg-rose-50", text: "text-rose-500", delta: "text-rose-500" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-500", delta: "text-emerald-500" },
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);

const SummaryCard = ({ label, value, valueType, delta, note, trend, iconKey, accent }) => {
  const IconComponent = iconMap[iconKey] || BusinessCenterOutlinedIcon;
  const styles = accentStyles[accent] || accentStyles.indigo;

  const displayValue = valueType === "currency" ? formatCurrency(value) : value;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs p-5 sm:p-6 flex items-start justify-between gap-4 transition-shadow hover:shadow-md">
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
          {label}
        </p>
        <p className="text-2xl sm:text-[28px] font-extrabold text-gray-900 tracking-tight leading-tight">
          {displayValue}
        </p>
        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          {trend === "positive" && (
            <TrendingUpOutlinedIcon className="text-emerald-500" sx={{ fontSize: 16 }} />
          )}
          <span
            className={`text-xs font-semibold ${
              trend === "positive" ? "text-emerald-500" : styles.delta
            }`}
          >
            {delta}
          </span>
          <span className="text-xs text-gray-400">{note}</span>
        </div>
      </div>

      <div className={`${styles.bg} rounded-xl p-3 shrink-0`}>
        <IconComponent className={styles.text} sx={{ fontSize: 24 }} />
      </div>
    </div>
  );
};

export default SummaryCard;
