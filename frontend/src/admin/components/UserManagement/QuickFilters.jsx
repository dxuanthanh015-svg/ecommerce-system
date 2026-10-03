import React from "react";

const formatLabel = (key) => {
  if (!key) return "";

  const result = key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');

  return result
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const QuickFilters = ({ quickFilter = {}, counts = {}, onToggle }) => {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
      <h3 className="text-sm font-semibold mb-4 text-gray-900 flex items-center gap-2">
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        QUICK FILTERS
      </h3>
      <div className="flex flex-col gap-2 text-sm text-gray-700">
        {Object.entries(quickFilter).map(([key, isChecked]) => {
          const count = counts[key]
          return (
            <label className="flex items-center gap-3 p-2.5 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-gray-200">
              <input type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                checked={!!isChecked}
                onChange={() => onToggle && onToggle(key)}
              />
              <span className="flex-1 font-medium">{formatLabel(key)}</span>
              {count > 0 && (
                <span className="bg-rose-100 text-rose-600 px-2.5 py-0.5 rounded-full text-xs font-semibold">{count}</span>
              )}
            </label>
          )
        })}
      </div>
    </div>
  );
};

export default QuickFilters;
