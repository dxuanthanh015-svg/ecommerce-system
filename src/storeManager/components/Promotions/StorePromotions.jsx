import React, { useMemo, useState, useEffect } from "react";
import PromotionsHeader from "./PromotionsHeader";
import PromotionStatsGrid from "./PromotionStatsGrid";
import PromotionQuickCreateCard from "./PromotionQuickCreateCard";
import PromotionCampaignList from "./PromotionCampaignList";
import { promotionsPageConfig } from "./promotions.data";
import { filterPromotionsByTab } from "./promotions.utils";
import { useCurrentStore } from "../../../hooks/useStoreQuery";
import { useVouchers, useCreateVoucher, useUpdateVoucher, useDeleteVoucher } from "../../../hooks/useVoucherQuery";
import toast from "react-hot-toast";

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
  const storeId = currentStore?.id || "store-001";
  const { data: vouchers = [], isLoading: loading } = useVouchers(storeId);

  const { mutateAsync: createVoucherMutate } = useCreateVoucher();
  const { mutate: updateVoucherMutate } = useUpdateVoucher();
  const { mutate: deleteVoucherMutate } = useDeleteVoucher();

  const [activeTab, setActiveTab] = useState(promotionsPageConfig.tabs[0]);
  const [formData, setFormData] = useState(initialFormState);
  const [selectedPromotionId, setSelectedPromotionId] = useState(null);

  // Dynamic metrics computed from vouchers
  const metrics = useMemo(() => {
    const activeCount = vouchers.filter((v) => (v.status || "").toLowerCase() === "active").length;
    const totalUsage = vouchers.reduce(
      (sum, v) => sum + (Number(v.usedCount) || Number(v.usageCount) || 0),
      0
    );
    const revenueImpact = vouchers.reduce(
      (sum, v) => sum + (Number(v.revenueImpact) || Number(v.totalDiscountGiven) || 0),
      0
    );

    return [
      {
        id: "active-vouchers",
        label: "Active Vouchers",
        value: activeCount,
        iconKey: "voucher",
        accent: "indigo",
      },
      {
        id: "total-usage",
        label: "Total Usage",
        value: totalUsage,
        iconKey: "usage",
        accent: "slate",
      },
      {
        id: "revenue-impact",
        label: "Revenue Impact",
        value: revenueImpact,
        valueType: "currencyCompact",
        iconKey: "impact",
        accent: "violet",
      },
    ];
  }, [vouchers]);

  // Filtered promotions based on selected tab
  const visiblePromotions = useMemo(
    () => filterPromotionsByTab(vouchers, activeTab),
    [vouchers, activeTab]
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

  const handleCreateVoucher = async (status) => {
    const trimmedCode = formData.code?.trim().toUpperCase();
    if (!trimmedCode) {
      toast.error("Vui lòng nhập mã Voucher!");
      return;
    }

    const isDup = vouchers.some((v) => (v.code || "").toUpperCase() === trimmedCode);
    if (isDup) {
      toast.error(`Mã voucher "${trimmedCode}" đã tồn tại trong cửa hàng!`);
      return;
    }

    const numValue = Number(formData.value) || 0;
    if (formData.discountType !== "Free Shipping" && numValue <= 0) {
      toast.error("Vui lòng nhập mức giảm giá hợp lệ lớn hơn 0!");
      return;
    }

    if (formData.discountType === "Percentage" && numValue > 100) {
      toast.error("Mức giảm theo phần trăm không được vượt quá 100%!");
      return;
    }

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        toast.error("Ngày bắt đầu không được lớn hơn ngày kết thúc!");
        return;
      }
    }

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
        description = `$${formData.value || "0"} off selected orders`;
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

      const newVoucher = await createVoucherMutate({ voucherDraft, storeId, status });
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
    deleteVoucherMutate(id);
    if (selectedPromotionId === id) {
      setSelectedPromotionId(null);
    }
  };

  const handleToggleStatus = (id, newStatus) => {
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
