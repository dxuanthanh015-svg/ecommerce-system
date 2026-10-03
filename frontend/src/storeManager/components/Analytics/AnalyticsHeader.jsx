import React from "react";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

const AnalyticsHeader = ({
  title = "Analytics & Financials",
  description = "Track your revenue, fees, and payouts.",
  exportLabel = "Export Report",
  onExport,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          {title}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>

      <button
        type="button"
        onClick={onExport}
        className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm px-4 py-2 rounded-xl transition-all cursor-pointer shadow-2xs flex items-center gap-2 shrink-0 self-start sm:self-auto"
      >
        <FileDownloadOutlinedIcon sx={{ fontSize: 18, color: "#64748b" }} />
        <span>{exportLabel}</span>
      </button>
    </div>
  );
};

export default AnalyticsHeader;
