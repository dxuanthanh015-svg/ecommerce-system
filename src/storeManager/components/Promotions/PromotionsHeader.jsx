import React from "react";
import AddIcon from "@mui/icons-material/Add";

const PromotionsHeader = ({ title, description, createLabel, onCreateVoucher }) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-[38px]">
          {title}
        </h1>
        <p className="mt-2 text-sm text-slate-500 sm:text-base">{description}</p>
      </div>

      <button
        type="button"
        onClick={onCreateVoucher}
        className="inline-flex w-fit items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
      >
        <AddIcon sx={{ fontSize: 18 }} />
        <span>{createLabel}</span>
      </button>
    </div>
  );
};

export default PromotionsHeader;
