import React from "react";

const OverviewCards = ({ overview = {} }) => {
  const cards = [
    { title: 'TOTAL PLATFORM GMV', value: `$${overview.platformGmv?.toFixed(1)}M`, note: '+8.4% this month' },
    { title: 'NET COMMISSIONS', value: `$${overview.netCommissions?.toFixed(1)}M`, note: '+12.1% this month' },
    { title: 'ESCROW FUNDS', value: `$${overview.escrowFunds?.toFixed(1)}M`, note: 'Pending clearing' },
    { title: 'TOTAL PAYOUTS', value: `$${overview.totalPayouts?.toFixed(1)}M`, note: 'Lifetime volume' },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.title} className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-xs text-gray-500">{card.title}</div>
          <div className="text-2xl font-extrabold mt-2">{card.value}</div>
          <div className="text-xs text-gray-400 mt-1">{card.note}</div>
        </div>
      ))}
    </div>
  );
};

export default OverviewCards;
