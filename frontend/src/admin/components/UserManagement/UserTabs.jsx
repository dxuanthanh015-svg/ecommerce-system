import React from "react";

const UserTabs = ({ tabs = ['All Users', 'Platform Admins', 'Sellers', 'Customers'], active = 0, onChange = () => { } }) => {
  return (
    <div className="flex gap-1 items-center border-b border-gray-200 px-4 pt-4">
      {tabs.map((t, i) => (
        <button
          key={t}
          onClick={() => onChange(i)}
          className={`px-4 py-3 text-sm font-medium transition-all ${i === active ? 'border-b-2 border-gray-900 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
          {t}
        </button>
      ))}
    </div>
  );
};

export default UserTabs;
