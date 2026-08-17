import React from "react";

const PayoutHealthRow = ({ item }) => {
  const colorMap = {
    yellow: 'bg-yellow-100 text-yellow-700',
    blue: 'bg-sky-100 text-sky-700',
    red: 'bg-rose-100 text-rose-700',
  };
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border mb-2">
      <span className="flex items-center gap-3 text-sm">
        <span className={`w-2 h-2 rounded-full ${colorMap[item.color] || 'bg-gray-300'}`} />
        {item.label}
      </span>
      <span className="text-sm font-semibold">{item.value}</span>
    </div>
  );
};

const PayoutHealth = ({ items = [] }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-3">Payout Health</h3>
      {items.map((item) => (
        <PayoutHealthRow key={item.label} item={item} />
      ))}
      <div className="mt-4 text-xs text-gray-500">Next automated batch payout scheduled for Friday, 5:00 PM UTC.</div>
      <button className="mt-4 w-full px-4 py-2 bg-white border rounded text-sm">Configure Schedule</button>
    </div>
  );
};

export default PayoutHealth;
