import React from "react";

const SystemLogs = ({ logs = [] }) => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold text-gray-900">System Logs</h4>
        <button className="text-xs text-gray-500 hover:underline">View All</button>
      </div>
      <div className="space-y-3 text-sm">
        {logs.length === 0 && <div className="text-gray-400">No logs</div>}
        {logs.map((l, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-500">{l.icon || 'i'}</div>
            <div className="flex-1">
              <div className="text-gray-800 font-semibold">{l.title}</div>
              <div className="text-xs text-gray-400">{l.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemLogs;
