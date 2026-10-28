import React, { useState } from "react";
import PromotionsHeader from "./PromotionsHeader";
import PromotionStatsGrid from "./PromotionStatsGrid";
import PromotionQuickCreateCard from "./PromotionQuickCreateCard";
import PromotionCampaignList from "./PromotionCampaignList";
import { promotionsPageConfig } from "./promotions.data";
import { filterPromotionsByTab } from "./promotions.utils";
import { useCurrentStore } from "../../../hooks/useStoreQuery";
import { useVouchers, useVoucherMetrics, useCreateVoucher, useUpdateVoucher, useDeleteVoucher } from "../../../hooks/useVoucherQuery";
import toast from "react-hot-toast";
import { formatVnd } from "../../../utils/currency";

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
  const { data: currentStore } = useCurrentStore();
  const storeId = currentStore?.id;
  const { data: vouchers = [], isLoading: loading } = useVouchers(storeId, { enabled: Boolean(storeId) });
  const { data: voucherMetrics = {} } = useVoucherMetrics(storeId, { enabled: Boolean(storeId) });

  const { mutateAsync: createVoucherMutate, isPending: isCreatingVoucher } = useCreateVoucher();
  const { mutate: updateVoucherMutate, isPending: isUpdatingVoucher, variables: updatingVoucherVar } = useUpdateVoucher();
  const { mutate: deleteVoucherMutate, isPending: isDeletingVoucher, variables: deletingVoucherId } = useDeleteVoucher();

  const [activeTab, setActiveTab] = useState(promotionsPageConfig.tabs[0]);
  const [formData, setFormData] = useState(initialFormState);
  const [selectedPromotionId, setSelectedPromotionId] = useState(null);

  const metrics = [
      {
        id: "active-vouchers",
        label: "Active Vouchers",
        value: voucherMetrics.activeVouchers || 0,
        iconKey: "voucher",
        accent: "indigo",
      },
      {
        id: "total-usage",
        label: "Total Usage",
        value: voucherMetrics.totalRedemptions || 0,
        iconKey: "usage",
        accent: "slate",
      },
      {
        id: "revenue-impact",
        label: "Revenue Impact",
        value: voucherMetrics.totalDiscountGiven || 0,
        valueType: "currencyCompact",
        iconKey: "impact",
        accent: "violet",
      },
    ];

  // Filtered promotions based on selected tab
  const visiblePromotions = filterPromotionsByTab(vouchers, activeTab);

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

  const handleCreateVoucher = async (status) => {
    if (isCreatingVoucher) return;
    const trimmedCode = formData.code?.trim().toUpperCase();
    if (!trimmedCode) {
      toast.error("Vui lòng nhập mã Voucher!");
      return;
    }

    const numValue = Number(formData.value) || 0;

    try {
      const normalizedType = formData.discountType?.toLowerCase();
      let type = "percentage";
      if (normalizedType.includes("flat") || normalizedType.includes("amount")) {
        type = "amount";
      } else if (normalizedType.includes("shipping")) {
        type = "shipping";
      }

      const hasSchedule = formData.startDate || formData.endDate;
      const scheduleLabel = hasSchedule
        ? `${formData.startDate || "Starts now"} - ${formData.endDate || "No end date"}`
        : "Starts immediately";

      let description = `${formData.value || "0"}% off your campaign`;
      if (type === "amount") {
        description = `${formatVnd(formData.value || 0)} off selected orders`;
      } else if (type === "shipping") {
        description = "Free shipping offer for selected shoppers";
      }

      const voucherDraft = {
        code: trimmedCode,
        title: trimmedCode,
        description,
        type,
        discountType: type,
        discountValue: numValue,
        minOrderValue: Number(formData.minOrderValue) || 0,
        maxDiscount: Number(formData.maxDiscountAmount) || 0,
        maxDiscountAmount: Number(formData.maxDiscountAmount) || 0,
        usageLimit: Number(formData.usageLimit) || 0,
        usedCount: 0,
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
        scheduleLabel,
        limitPerCustomer: Boolean(formData.limitPerCustomer),
      };

      const newVoucher = await createVoucherMutate({ voucherDraft, storeId, status: status.toUpperCase() });
      setSelectedPromotionId(newVoucher?.id || `vouch_${Date.now()}`);
      setActiveTab(status === "Active" ? "Active" : "Draft");
      resetForm();
      toast.success(`Tạo voucher "${trimmedCode}" thành công!`);
    } catch (err) {
      console.error("Error creating voucher:", err);
      toast.error("Lỗi khi tạo voucher: " + err.message);
    }
  };

  const handleDeletePromotion = (id) => {
    if (isDeletingVoucher) return;
    deleteVoucherMutate(id);
    if (selectedPromotionId === id) {
      setSelectedPromotionId(null);
    }
  };

  const handleToggleStatus = (id, newStatus) => {
    if (isUpdatingVoucher) return;
    updateVoucherMutate({ voucherId: id, updateData: { status: newStatus } });
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
          isCreating={isCreatingVoucher}
          onFormChange={handleFormChange}
          onSaveDraft={() => handleCreateVoucher("DRAFT")}
          onPublish={() => handleCreateVoucher("ACTIVE")}
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
            isDeletingVoucher={isDeletingVoucher}
            deletingVoucherId={deletingVoucherId}
            isUpdatingVoucher={isUpdatingVoucher}
            updatingVoucherId={updatingVoucherVar?.voucherId}
          />
        </div>
      </div>
    </div>
  );
};

export default StorePromotions;
