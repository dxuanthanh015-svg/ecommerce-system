import React, { useState, useMemo } from "react";
import SellerHeader from "./SellerHeader";
import SellerTable from "./SellerTable";
import ReviewStoreModal from "./ReviewStoreModal";
import NewStoreModal from "./NewStoreModal";
import EditStoreModal from "./EditStoreModal";
import {
  useApproveStoreApplication,
  useRejectStoreApplication,
  useAdminDashboardQuery,
} from "../../../hooks/useAdminQuery";

const SellerManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  // Modals state
  const [reviewModalStore, setReviewModalStore] = useState(null);
  const [editModalStore, setEditModalStore] = useState(null);
  const [isNewStoreModalOpen, setIsNewStoreModalOpen] = useState(false);

  // Data queries & mutations
  const { data: dashboardData, isLoading, isError } = useAdminDashboardQuery();
  const apiStores = dashboardData?.store || [];
  const approveMutation = useApproveStoreApplication();
  const rejectMutation = useRejectStoreApplication();


  const combinedSellers = useMemo(() => {
    const formattedApiStores = (apiStores || []).map((s) => {
      const storeName = s.name || s.storeName || "Gian hàng";
      return {
        id: s.id || s._id,
        initials: storeName.charAt(0).toUpperCase(),
        name: storeName,
        description: s.category || s.primaryCategory || "Retail & E-commerce",
        owner: s.owner || s.ownerName || s.email || "Store Owner",
        gmv: s.totalSales ? `$${Number(s.totalSales).toLocaleString()}` : "$0",
        status: (s.status || "ACTIVE").toUpperCase(),
        joined: s.createdAt
          ? new Date(s.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })
          : "Recently",
        raw: s,
      };
    });

    const pendingApps = (dashboardData?.systemLogs || []).map((log) => {
      const app = log.application || {};
      const storeName = app.shopName || app.storeName || log.title || "Gian hàng mới";
      return {
        id: log.id || app.storeId,
        initials: storeName.charAt(0).toUpperCase(),
        name: storeName,
        description: app.primaryCategory || app.shopDescription || "Pending Store",
        owner: app.applicantName || app.accountHolder || log.applicantName || "Merchant",
        gmv: "$0",
        status: "PENDING APPROVAL",
        joined: log.submittedAt || "Today",
        raw: app,
      };
    });



    return [...formattedApiStores, ...pendingApps];
  }, [apiStores, dashboardData]);

  // Lọc theo search và filter
  const filteredSellers = useMemo(() => {
    return combinedSellers.filter((s) => {
      const matchesSearch =
        !searchTerm.trim() ||
        (s.name && s.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (s.owner && s.owner.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (s.description && s.description.toLowerCase().includes(searchTerm.toLowerCase()));

      let matchesFilter = true;
      if (activeFilter === "ACTIVE") {
        matchesFilter = s.status === "ACTIVE" || s.status === "APPROVED";
      } else if (activeFilter === "PENDING") {
        matchesFilter = s.status.includes("PENDING");
      } else if (activeFilter === "BLOCKED") {
        matchesFilter = s.status === "BLOCKED" || s.status === "REJECTED";
      }

      return matchesSearch && matchesFilter;
    });
  }, [combinedSellers, searchTerm, activeFilter]);

  // Actions
  const handleReview = (seller) => {
    setReviewModalStore(seller);
  };

  const handleEdit = (seller) => {
    setEditModalStore(seller);
  };

  const handleApprovePending = () => {
    if (!reviewModalStore) return;
    const app = reviewModalStore.raw || reviewModalStore;
    approveMutation.mutate(app, {
      onSuccess: () => setReviewModalStore(null),
    });
  };

  const handleRejectPending = () => {
    if (!reviewModalStore) return;
    const appId = reviewModalStore.raw?._id || reviewModalStore.id;
    rejectMutation.mutate(appId, {
      onSuccess: () => setReviewModalStore(null),
    });
  };


  if (isLoading) {
    return <div className="p-8 text-center text-gray-500 font-medium animate-pulse">Loading stores...</div>;
  }
  if (isError || !apiStores) {
    return <div className="p-8 text-center text-rose-500 font-medium">Error loading stores</div>;
  }

  return (
    <div className="space-y-6 font-sans pb-10">
      {/* 1. Header Section */}
      <SellerHeader
        searchTerm={searchTerm}
        onSearchChange={(value) => {
          setSearchTerm(value);
          setCurrentPage(1);
        }}
        activeFilter={activeFilter}
        onFilterChange={(value) => {
          setActiveFilter(value);
          setCurrentPage(1);
        }}
        onNewStoreClick={() => setIsNewStoreModalOpen(true)}
      />

      {/* 2. Table Section */}
      <SellerTable
        sellers={filteredSellers}
        totalCount={Math.max(filteredSellers.length, 128)}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onReview={handleReview}
        onEdit={handleEdit}
        onMore={handleEdit}
      />

      {/* 3. Review Modal */}
      <ReviewStoreModal
        store={reviewModalStore}
        onClose={() => setReviewModalStore(null)}
        onApprove={handleApprovePending}
        onReject={handleRejectPending}
        isApproving={approveMutation.isPending}
        isRejecting={rejectMutation.isPending}
      />

      {/* 4. Add New Store Modal */}
      <NewStoreModal
        isOpen={isNewStoreModalOpen}
        onClose={() => setIsNewStoreModalOpen(false)}
      />

      {/* 5. Edit Store Modal */}
      <EditStoreModal
        store={editModalStore}
        onClose={() => setEditModalStore(null)}
      />
    </div>
  );
};

export default SellerManagement;
