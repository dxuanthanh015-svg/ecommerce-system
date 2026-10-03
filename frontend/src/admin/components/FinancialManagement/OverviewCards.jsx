import React from "react";

const OverviewCards = ({ overview = {} }) => {
  const hasData = overview && (overview.platformGmv || overview.netCommissions || overview.escrowFunds || overview.totalPayouts);
  
  const cards = [
    { title: 'TOTAL PLATFORM GMV', value: overview.platformGmv ? `$${overview.platformGmv.toFixed(1)}M` : 'No data', note: '+8.4% this month', icon: 'chart', color: 'blue' },
    { title: 'NET COMMISSIONS', value: overview.netCommissions ? `$${overview.netCommissions.toFixed(1)}M` : 'No data', note: '+12.1% this month', icon: 'dollar', color: 'green' },
    { title: 'ESCROW FUNDS', value: overview.escrowFunds ? `$${overview.escrowFunds.toFixed(1)}M` : 'No data', note: 'Pending clearing', icon: 'lock', color: 'yellow' },
    { title: 'TOTAL PAYOUTS', value: overview.totalPayouts ? `$${overview.totalPayouts.toFixed(1)}M` : 'No data', note: 'Lifetime volume', icon: 'bank', color: 'purple' },
  ];

  const iconMap = {
    chart: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
    dollar: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    lock: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
    bank: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  };

  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  if (!hasData) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{card.title}</div>
            <div className="text-2xl font-bold text-gray-400 mt-2">No data</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{card.title}</div>
            <div className={`w-10 h-10 ${colorMap[card.color]} rounded-lg flex items-center justify-center`}>
              {iconMap[card.icon]}
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{card.value}</div>
          <div className={`text-sm mt-2 font-medium ${card.note.includes('+') ? 'text-emerald-600 bg-emerald-50' : 'text-gray-500'} inline-block px-2 py-1 rounded`}>{card.note}</div>
        </div>
      ))}
    </div>
  );
};

export default OverviewCards;
