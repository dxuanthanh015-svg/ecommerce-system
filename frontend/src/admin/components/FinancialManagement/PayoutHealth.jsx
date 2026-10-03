import React from "react";

const PayoutHealthRow = ({ item }) => {
  const colorMap = {
    yellow: { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' },
    blue: { bg: 'bg-sky-100', text: 'text-sky-700', dot: 'bg-sky-500' },
    red: { bg: 'bg-rose-100', text: 'text-rose-700', dot: 'bg-rose-500' },
  };
  const colors = colorMap[item.color] || { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-400' };
  
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 mb-2 hover:bg-gray-50 transition-colors">
      <span className="flex items-center gap-3 text-sm text-gray-700">
        <span className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} />
        {item.label}
      </span>
      <span className={`text-sm font-semibold ${colors.bg} ${colors.text} px-2.5 py-0.5 rounded-full`}>{item.value}</span>
    </div>
  );
};

const PayoutHealth = ({ items = [] }) => {
  if (!items || items.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Payout Health</h3>
        <div className="text-sm text-gray-500 py-8 text-center">No payout data available</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="font-semibold text-gray-900 mb-4">Payout Health</h3>
      {items.map((item) => (
        <PayoutHealthRow key={item.label} item={item} />
      ))}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <div className="text-xs text-blue-700">Next automated batch payout scheduled for Friday, 5:00 PM UTC.</div>
      </div>
      <button className="mt-4 w-full px-4 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg text-sm font-medium text-gray-700 transition-colors">Configure Schedule</button>
    </div>
  );
};

export default PayoutHealth;
