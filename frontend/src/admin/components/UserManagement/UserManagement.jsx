import React, { useState, useMemo, useCallback } from "react";
import UserFilters from "./UserFilters";
import UserTable from "./UserTable";
import UserStatsCard from "./UserStatsCard";
import UserTabs from "./UserTabs";
import QuickFilters from "./QuickFilters";
import UserPagination from "./UserPagination";
import { useAdminDashboardQuery } from "../../../hooks/useAdminQuery";
import { hasRole, ROLE } from "../../../constants/roles";

// --- CÁC HÀM BỔ TRỢ HELPER (Đặt ngoài Component để tránh re-create khi re-render) ---
const calculateRecencyScore = (lastOrderDate) => {
  if (!lastOrderDate) return 1;
  const now = new Date();
  const orderDate = new Date(lastOrderDate);
  const daysSince = (now - orderDate) / (1000 * 60 * 60 * 24);

  if (daysSince <= 1) return 5;
  if (daysSince <= 7) return 4;
  if (daysSince <= 30) return 3;
  if (daysSince <= 90) return 2;
  return 1;
};

const calculateFrequencyScore = (orderCount) => {
  if (orderCount === 0) return 1;
  if (orderCount >= 10) return 5;
  if (orderCount >= 6) return 4;
  if (orderCount >= 3) return 3;
  if (orderCount >= 1) return 2;
  return 1;
};

const calculateMoneyScore = (totalSpend) => {
  if (totalSpend === 0) return 1;
  if (totalSpend >= 5000) return 5;
  if (totalSpend >= 3000) return 4;
  if (totalSpend >= 1000) return 3;
  if (totalSpend >= 500) return 2;
  return 1;
};

const calculateRFMScore = (userItem, ordersData = []) => {
  if (hasRole(userItem.roles, ROLE.STORE_MANAGER) || hasRole(userItem.roles, ROLE.ADMIN)) {
    return { R: 0, F: 0, M: 0, score: 0, segment: "NON_CUSTOMER" };
  }

  const userOrders = ordersData.filter((order) => {
    const orderEmail = order.customerEmail || order.email;
    return orderEmail && orderEmail.toLowerCase() === userItem.email?.toLowerCase();
  });

  if (userOrders.length === 0) {
    return { R: 0, F: 0, M: 0, score: 0, segment: "NON_CUSTOMER" };
  }

  const sortedOrders = [...userOrders].sort((a, b) => {
    const dateA = new Date(a.date || a.createdAt);
    const dateB = new Date(b.date || b.createdAt);
    return dateB - dateA;
  });

  const lastOrderDate = sortedOrders[0]?.date || sortedOrders[0]?.createdAt;
  const orderCount = userOrders.length;
  const totalSpend = userOrders.reduce((sum, order) => {
    return sum + Number(order.totalAmount || order.total || 0);
  }, 0);

  const R = calculateRecencyScore(lastOrderDate);
  const F = calculateFrequencyScore(orderCount);
  const M = calculateMoneyScore(totalSpend);

  let segment = "NEW_CUSTOMER";
  if ((R >= 4 && F >= 4) || (R >= 4 && M >= 4)) segment = "CHAMPION";
  else if (R >= 4 && F >= 3 && M >= 3) segment = "LOYAL_CUSTOMERS";
  else if (R >= 3 && F >= 1 && M >= 2) segment = "POTENTIAL_LOYALISTS";
  else if (R === 5 && F === 1 && M <= 2) segment = "NEW_CUSTOMERS";
  else if (R >= 2 && R <= 3 && F >= 2 && M >= 2) segment = "AT_RISK";
  else if (R <= 2 && F >= 4 && M >= 4) segment = "CANT_LOSE";
  else if (R === 1 && F <= 2 && M <= 2) segment = "HIBERNATING";
  else if (R === 1 && F === 1 && M === 1) segment = "LOST";

  return { R, F, M, segment, totalSpend, orderCount, lastOrderDate };
};

const checkRFMSegment = (u, segment) => u.rfm?.segment === segment;

// --- MAIN COMPONENT ---
const UserManagement = () => {
  const { data, isLoading, isError, refetch } = useAdminDashboardQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [quickFilter, setQuickFilter] = useState({
    champions: false,
    loyalCustomers: false,
    atRisk: false,
    potentialLoyalists: false,
    newCustomers: false,
    cantLose: false,
    hibernating: false,
    lost: false,
    dailyActive: false,
  });

  const [page, setPage] = useState(0);

  const totalUser = data?.totalCustomer || 0;
  const delta = data?.deltaCustomer || 0;
  const user = data?.user || [];
  const ordersData = data?.orders || [];

  // 1. Memoize enrichedUser chính xác
  const enrichedUser = useMemo(() => {
    return user.map((rawUser) => {
      const rfm = calculateRFMScore(rawUser, ordersData);
      return { ...rawUser, rfm };
    });
  }, [user, ordersData]);

  // 2. Tính toán Quick Filter Counts
  const quickFilterCounts = useMemo(() => {
    return {
      champions: enrichedUser.filter((u) => checkRFMSegment(u, "CHAMPION")).length,
      loyalCustomers: enrichedUser.filter((u) => checkRFMSegment(u, "LOYAL_CUSTOMERS")).length,
      atRisk: enrichedUser.filter((u) => checkRFMSegment(u, "AT_RISK")).length,
      potentialLoyalists: enrichedUser.filter((u) => checkRFMSegment(u, "POTENTIAL_LOYALISTS")).length,
      newCustomers: enrichedUser.filter((u) => checkRFMSegment(u, "NEW_CUSTOMERS")).length,
      cantLose: enrichedUser.filter((u) => checkRFMSegment(u, "CANT_LOSE")).length,
      hibernating: enrichedUser.filter((u) => checkRFMSegment(u, "HIBERNATING")).length,
      lost: enrichedUser.filter((u) => checkRFMSegment(u, "LOST")).length,
      dailyActive: enrichedUser.filter((u) => u.rfm?.R === 5).length,
    };
  }, [enrichedUser]);

  // 3. Filter danh sách User
  const PAGE_SIZE = 10;
  const filteredUsers = useMemo(() => {
    let result = enrichedUser;

    if (activeTab === 1) {
      result = result.filter((u) => hasRole(u.roles, ROLE.ADMIN));
    } else if (activeTab === 2) {
      result = result.filter((u) => hasRole(u.roles, ROLE.STORE_MANAGER));
    } else if (activeTab === 3) {
      result = result.filter(
        (u) => hasRole(u.roles, ROLE.CUSTOMER) && !hasRole(u.roles, ROLE.STORE_MANAGER)
      );
    }

    if (searchTerm.trim()) {
      const keyword = searchTerm.toLowerCase();
      result = result.filter(
        (userItem) =>
          userItem.lastName?.toLowerCase().includes(keyword) ||
          userItem.email?.toLowerCase().includes(keyword)
      );
    }



    const anyOn = Object.values(quickFilter).some(Boolean);
    if (anyOn) {
      result = result.filter((u) => {
        if (quickFilter.champions && checkRFMSegment(u, "CHAMPION")) return true;
        if (quickFilter.loyalCustomers && checkRFMSegment(u, "LOYAL_CUSTOMERS")) return true;
        if (quickFilter.atRisk && checkRFMSegment(u, "AT_RISK")) return true;
        if (quickFilter.potentialLoyalists && checkRFMSegment(u, "POTENTIAL_LOYALISTS")) return true;
        if (quickFilter.newCustomers && checkRFMSegment(u, "NEW_CUSTOMERS")) return true;
        if (quickFilter.cantLose && checkRFMSegment(u, "CANT_LOSE")) return true;
        if (quickFilter.hibernating && checkRFMSegment(u, "HIBERNATING")) return true;
        if (quickFilter.lost && checkRFMSegment(u, "LOST")) return true;
        if (quickFilter.dailyActive && u.rfm?.R === 5) return true;
        return false;
      });
    }
    return result;
  }, [enrichedUser, activeTab, searchTerm, quickFilter]);

  if (isLoading) {
    return (
      <div className="w-full space-y-4 p-6 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded-md"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex items-center space-x-4 p-4 border border-gray-100 rounded-lg bg-gray-50">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 m-6 border border-red-100 rounded-xl bg-red-50/50 text-center">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 text-red-500 mb-3">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Không thể tải dữ liệu</h3>
        <p className="text-sm text-gray-500 max-w-sm mt-1 mb-4">
          Đã có lỗi xảy ra trong quá trình lấy danh sách người dùng. Vui lòng kiểm tra lại kết nối.
        </p>
        <button
          onClick={() => refetch && refetch()}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
  const paginatedUsers = filteredUsers.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">User Directory</h1>
          <p className="text-base text-gray-500 mt-1">Manage platform administrators, sellers, and customer accounts.</p>
        </div>
        <UserFilters
          searchTerm={searchTerm}
          onSearchChange={(value) => {
            setSearchTerm(value);
            setPage(0);
          }}
        />
      </div>

      <div className="grid grid-cols-12 gap-6">
        <aside className="col-span-3 space-y-4">
          <UserStatsCard totalUsers={totalUser} delta={delta} />
          <QuickFilters
            quickFilter={quickFilter}
            counts={quickFilterCounts}
            onToggle={(key) => {
              setQuickFilter((prev) => ({ ...prev, [key]: !prev[key] }));
              setPage(0);
            }}
          />
        </aside>

        <main className="col-span-9">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <UserTabs
              active={activeTab}
              onChange={(i) => { setActiveTab(i); setPage(0); }}
            />
            <UserTable
              users={paginatedUsers}
              totalCount={filteredUsers.length}
              calculateRFMScore={calculateRFMScore}
              ordersData={ordersData}
            />
            <UserPagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              filteredUsers={filteredUsers}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserManagement;
