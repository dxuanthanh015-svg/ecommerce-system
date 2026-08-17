import React from "react";

const QuickFilters = ({ counts = { needsReview: 12 } }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <h3 className="text-sm font-semibold mb-3">QUICK FILTERS</h3>
      <div className="flex flex-col gap-2 text-sm text-gray-700">
        <label className="flex items-center gap-2">
          <input type="checkbox" />
          <span>Needs Review</span>
          <span className="ml-auto bg-rose-100 text-rose-600 px-2 py-0.5 rounded text-xs font-semibold">{counts.needsReview}</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" />
          <span>Locked Accounts</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" />
          <span>Pending MFA Setup</span>
        </label>
      </div>
    </div>
  );
};

export default QuickFilters;
