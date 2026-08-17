import React from "react";

const UserStatsCard = ({ totalUsers = 0, delta = "" }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="text-xs text-gray-500">TOTAL USERS</div>
      <div className="text-3xl font-extrabold mt-2">{totalUsers.toLocaleString()}</div>
      <div className="text-sm text-gray-500 mt-1">{delta}</div>
    </div>
  );
};

export default UserStatsCard;
