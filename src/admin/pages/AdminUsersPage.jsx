import React from "react";
import UserFilters from "../components/UserManagement/UserFilters";
import UserTable from "../components/UserManagement/UserTable";
import UserStatsCard from "../components/UserManagement/UserStatsCard";
import UserTabs from "../components/UserManagement/UserTabs";
import QuickFilters from "../components/UserManagement/QuickFilters";
import UserPagination from "../components/UserManagement/UserPagination";
import { DEFAULT_USERS, USER_STATS } from "../components/UserManagement/userManagement.data";

const AdminUsersPage = () => {
  return (
    <div className="min-h-screen bg-[#f8f7f9] font-sans">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">User Directory</h1>
          <p className="text-sm text-gray-500">Manage platform administrators, sellers, and customer accounts.</p>
        </div>
        <div className="flex items-center gap-3">
          <UserFilters />
          <button className="bg-black text-white px-4 py-2 rounded-lg text-sm">Add New Admin</button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <aside className="col-span-3">
          <UserStatsCard totalUsers={USER_STATS.totalUsers} delta={USER_STATS.delta} />
          <div className="mt-4">
            <QuickFilters counts={{ needsReview: 12 }} />
          </div>
        </aside>

        <main className="col-span-9">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <UserTabs />
            <UserTable users={DEFAULT_USERS} totalCount={USER_STATS.totalUsers} />
            <UserPagination page={1} totalPages={12} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminUsersPage;
