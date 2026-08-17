import React from "react";

const UserTabs = ({ tabs = ['All Users','Platform Admins','Sellers','Customers'], active = 0, onChange = () => {} }) => {
  return (
    <div className="flex gap-2 items-center border-b border-gray-200 mb-3">
      {tabs.map((t, i) => (
        <button
          key={t}
          onClick={() => onChange(i)}
          className={`px-4 py-2 text-sm ${i === active ? 'border-b-2 border-indigo-600 text-indigo-700' : 'text-gray-600'}`}>
          {t}
        </button>
      ))}
    </div>
  );
};

export default UserTabs;
