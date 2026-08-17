import React from "react";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

const AnalyticsHeader = ({ title, description, exportLabel, onExport }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          {title}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-500">{description}</p>
      </div>

      <button
        type="button"
        onClick={onExport}
        className="border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 font-semibold text-sm px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-2xs flex items-center gap-2 shrink-0 self-start"
      >
        <FileDownloadOutlinedIcon sx={{ fontSize: 18 }} />
        <span>{exportLabel}</span>
      </button>
    </div>
  );
};

export default AnalyticsHeader;
