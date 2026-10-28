import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import UserFilters from "./UserFilters";
import UserTable from "./UserTable";
import UserStatsCard from "./UserStatsCard";
import UserTabs from "./UserTabs";
import QuickFilters from "./QuickFilters";
import UserPagination from "./UserPagination";
import { useAdminDashboardQuery } from "../../../hooks/useAdminQuery";
import { adminService } from "../../../services/adminService";

const PAGE_SIZE = 10;
const FILTER_TO_SEGMENT = {
  champions: "CHAMPION",
  loyalCustomers: "LOYAL_CUSTOMERS",
  atRisk: "AT_RISK",
  potentialLoyalists: "POTENTIAL_LOYALISTS",
  newCustomers: "NEW_CUSTOMERS",
  cantLose: "CANT_LOSE",
  hibernating: "HIBERNATING",
  lost: "LOST",
  dailyActive: "DAILY_ACTIVE",
};

const UserManagement = () => {
  const { data: dashboardData } = useAdminDashboardQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(0);
  const [quickFilter, setQuickFilter] = useState(
    Object.fromEntries(Object.keys(FILTER_TO_SEGMENT).map((key) => [key, false]))
  );

  const selectedSegments = Object.entries(quickFilter)
    .filter(([, enabled]) => enabled)
    .map(([key]) => FILTER_TO_SEGMENT[key]);
  const role = [null, "ADMIN", "STORE_MANAGER", "CUSTOMER"][activeTab];
  const filters = {
    page,
    size: PAGE_SIZE,
    search: searchTerm.trim() || undefined,
    role: role || undefined,
    segment: selectedSegments.length ? selectedSegments.join(",") : undefined,
  };
  const { data: usersPage, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin", "user-segments", filters],
    queryFn: () => adminService.fetchUserSegments(filters),
    placeholderData: (previousData) => previousData,
    staleTime: 30_000,
  });

  const totalUsers = dashboardData?.totalUsers ?? dashboardData?.totalCustomer ?? 0;
  const users = usersPage?.content || [];
  const totalCount = usersPage?.totalElements || 0;
  const segmentCounts = usersPage?.segmentCounts || {};
  const counts = {
    champions: segmentCounts.CHAMPION || 0,
    loyalCustomers: segmentCounts.LOYAL_CUSTOMERS || 0,
    atRisk: segmentCounts.AT_RISK || 0,
    potentialLoyalists: segmentCounts.POTENTIAL_LOYALISTS || 0,
    newCustomers: segmentCounts.NEW_CUSTOMERS || 0,
    cantLose: segmentCounts.CANT_LOSE || 0,
    hibernating: segmentCounts.HIBERNATING || 0,
    lost: segmentCounts.LOST || 0,
    dailyActive: segmentCounts.DAILY_ACTIVE || 0,
  };

  if (isLoading && !usersPage) {
    return <div className="w-full space-y-4 p-6 animate-pulse"><div className="h-8 w-48 bg-gray-200 rounded-md" /><div className="h-64 bg-gray-100 rounded-xl" /></div>;
  }

  if (isError) {
    return <div className="flex flex-col items-center justify-center p-8 m-6 border border-red-100 rounded-xl bg-red-50/50 text-center">
      <h3 className="text-lg font-semibold text-gray-900">Không thể tải dữ liệu</h3>
      <p className="text-sm text-gray-500 max-w-sm mt-1 mb-4">Đã có lỗi xảy ra khi lấy danh sách người dùng.</p>
      <button onClick={() => refetch()} className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg">Thử lại</button>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-3xl font-bold text-gray-900 tracking-tight">User Directory</h1><p className="text-base text-gray-500 mt-1">Manage platform administrators, sellers, and customer accounts.</p></div>
        <UserFilters searchTerm={searchTerm} onSearchChange={(value) => { setSearchTerm(value); setPage(0); }} />
      </div>
      <div className="grid grid-cols-12 gap-6">
        <aside className="col-span-3 space-y-4">
          <UserStatsCard totalUsers={totalUsers} delta={dashboardData?.deltaCustomer || 0} />
          <QuickFilters quickFilter={quickFilter} counts={counts} onToggle={(key) => {
            setQuickFilter((previous) => ({ ...previous, [key]: !previous[key] }));
            setPage(0);
          }} />
        </aside>
        <main className="col-span-9">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <UserTabs active={activeTab} onChange={(index) => { setActiveTab(index); setPage(0); }} />
            <UserTable users={users} totalCount={totalCount} page={page} pageSize={PAGE_SIZE} />
            <UserPagination page={page} totalPages={usersPage?.totalPages || 0} onPageChange={setPage} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserManagement;
