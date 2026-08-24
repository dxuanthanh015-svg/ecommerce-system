import React, { useMemo, useState } from "react";
import PromotionsHeader from "./PromotionsHeader";
import PromotionStatsGrid from "./PromotionStatsGrid";
import PromotionQuickCreateCard from "./PromotionQuickCreateCard";
import PromotionCampaignList from "./PromotionCampaignList";
import { promotionsPageConfig } from "./promotions.data";
import { filterPromotionsByTab } from "./promotions.utils";
import {
  createVoucher,
  loadVouchers,
  getPromotionMetrics,
  isVoucherCodeDuplicate,
  removeVoucher,
  toggleVoucherStatus,
} from "./voucher.utils";

const initialFormState = {
  code: "",
  discountType: "Percentage",
  value: "",
  minOrderValue: "",
  maxDiscountAmount: "",
  usageLimit: "",
  startDate: "",
  endDate: "",
  limitPerCustomer: false,
};

const StorePromotions = () => {
  const currentStore = JSON.parse(localStorage.getItem("currentStore")) || {};
  const storeId = currentStore.id || "store-001";

  // Vouchers state loaded directly from localStorage
  const [vouchers, setVouchers] = useState(() => loadVouchers(storeId));
  const [activeTab, setActiveTab] = useState(promotionsPageConfig.tabs[0]);
  const [formData, setFormData] = useState(initialFormState);
  const [selectedPromotionId, setSelectedPromotionId] = useState(
    vouchers[0]?.id || null,
  );

  // Dynamic metrics computed from localStorage
  const metrics = useMemo(() => getPromotionMetrics(storeId), [vouchers, storeId]);

  // Filtered promotions based on selected tab
  const visiblePromotions = useMemo(
    () => filterPromotionsByTab(vouchers, activeTab),
    [vouchers, activeTab],
  );

  const handleFormChange = (event) => {
    const { name, type, value, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setFormData(initialFormState);
  };

  const handleCreateVoucher = (status) => {
    const trimmedCode = formData.code?.trim().toUpperCase();
    if (!trimmedCode) {
      alert("Vui lòng nhập mã Voucher!");
      return;
    }

    // 1. Check duplicate code
    if (isVoucherCodeDuplicate(trimmedCode, storeId)) {
      alert(`Mã voucher "${trimmedCode}" đã tồn tại trong cửa hàng của bạn!`);
      return;
    }

    // 2. Validate discount value
    const numValue = Number(formData.value) || 0;
    if (formData.discountType !== "Free Shipping" && numValue <= 0) {
      alert("Vui lòng nhập mức giảm giá hợp lệ lớn hơn 0!");
      return;
    }

    if (formData.discountType === "Percentage" && numValue > 100) {
      alert("Mức giảm theo phần trăm không được vượt quá 100%!");
      return;
    }

    // 3. Validate dates
    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        alert("Ngày bắt đầu không được lớn hơn ngày kết thúc!");
        return;
      }
    }

    const newVoucher = createVoucher(formData, storeId, status);
    if (!newVoucher) return;

    // Update state directly from localStorage
    setVouchers(loadVouchers(storeId));
    setSelectedPromotionId(newVoucher.id);
    setActiveTab(status === "Active" ? "Active" : "Draft");
    resetForm();
  };

  const handleDeletePromotion = (id) => {
    removeVoucher(id);
    setVouchers(loadVouchers(storeId));
    if (selectedPromotionId === id) {
      setSelectedPromotionId(null);
    }
  };

  const handleToggleStatus = (id, newStatus) => {
    toggleVoucherStatus(id, newStatus);
    setVouchers(loadVouchers(storeId));
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PromotionsHeader
        title={promotionsPageConfig.header.title}
        description={promotionsPageConfig.header.description}
        createLabel={promotionsPageConfig.header.createLabel}
        onCreateVoucher={resetForm}
      />

      <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <PromotionQuickCreateCard
          title="Create New Voucher"
          formData={formData}
          discountTypes={promotionsPageConfig.discountTypes}
          draftButtonLabel="Save as Draft"
          publishButtonLabel="Publish Voucher"
          onFormChange={handleFormChange}
          onSaveDraft={() => handleCreateVoucher("Draft")}
          onPublish={() => handleCreateVoucher("Active")}
        />

        <div className="space-y-4">
          <PromotionStatsGrid metrics={metrics} />

          <PromotionCampaignList
            title="Recent Promotions"
            tabs={promotionsPageConfig.tabs}
            activeTab={activeTab}
            promotions={visiblePromotions}
            viewAllLabel="View All Promotions"
            selectedPromotionId={selectedPromotionId}
            onTabChange={setActiveTab}
            onSelectPromotion={setSelectedPromotionId}
            onDeletePromotion={handleDeletePromotion}
            onToggleStatus={handleToggleStatus}
          />
        </div>
      </div>
    </div>
  );
};

export default StorePromotions;
