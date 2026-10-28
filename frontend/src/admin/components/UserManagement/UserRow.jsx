import React from "react";

const getDisplayName = (user) =>
  [user.firstName, user.lastName].filter((part) => part?.trim()).join(" ").trim() ||
  user.name?.trim() ||
  user.email ||
  "User";

const getInitials = (name) => {
  const words = name
    // Split regular names and camel-cased names such as "NexCart" into initials.
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length > 1) return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
  return (words[0] || "U")[0].toUpperCase();
};

const UserRow = ({ user, onToggleSelect = () => { }, selected = false }) => {
  const rfmResult = user.rfm || {};
  const displayName = getDisplayName(user);
  return (
    <tr className={`text-sm border-b border-gray-100 hover:bg-gray-50 transition-colors ${selected ? 'bg-blue-50' : ''}`}>
      <td className="p-4">
        <input type="checkbox" checked={selected} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" onChange={(e) => onToggleSelect(user.id, e.target.checked)} />
      </td>
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-sm font-bold text-white shadow-sm overflow-hidden shrink-0">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              getInitials(displayName)
            )}
          </div>
          <div>
            <div className="font-semibold text-gray-900">{displayName}</div>
            <div className="text-xs text-gray-500">{user.email}</div>
          </div>
        </div>
      </td>
      <td className="p-4 text-gray-700 font-semibold">{(user.roles || []).map((u) => `${u.toUpperCase()} `)}</td>
      <td className="p-4">
        <span className="align-middle text-sm text-gray-700 capitalize font-medium">
          {rfmResult.segment}
        </span>
      </td>
      <td className="p-4 text-gray-500 font-semibold">{rfmResult?.lastOrderDate?.slice(0, 10) || "None"}</td>
    </tr>
  );
};

export default UserRow;
