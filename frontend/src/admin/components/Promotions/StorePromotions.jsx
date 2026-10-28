import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";
import PromotionsHeader from "./PromotionsHeader";
import PromotionStatsGrid from "./PromotionStatsGrid";
import PromotionQuickCreateCard from "./PromotionQuickCreateCard";
import PromotionCampaignList from "./PromotionCampaignList";
import { filterPromotionsByTab } from "./promotions.utils";
import { useVouchers, useVoucherMetrics, useCreateVoucher } from "../../../hooks/useVoucherQuery";

const initialDraft = {
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
const tabs = ["All", "Active", "Draft", "Expired"];
const discountTypes = ["Percentage", "Flat Amount", "Free Shipping"];

const StorePromotions = () => {
  const { data: vouchers = [], isLoading, isError: vouchersError } = useVouchers(null);
  const { data: voucherMetrics, isLoading: metricsLoading, isError: metricsError } = useVoucherMetrics(null);
  const { mutateAsync: createVoucher, isPending } = useCreateVoucher();
  const [activeTab, setActiveTab] = useState("All");
  const [draft, setDraft] = useState(initialDraft);
  const [selectedId, setSelectedId] = useState(null);
  const visiblePromotions = useMemo(() => filterPromotionsByTab(vouchers, activeTab), [vouchers, activeTab]);
  const metrics = [
    { id: "active-vouchers", label: "Active Vouchers", value: voucherMetrics?.activeVouchers ?? (metricsLoading ? "…" : "—"), iconKey: "voucher", accent: "indigo" },
    { id: "total-usage", label: "Total Usage", value: voucherMetrics?.totalRedemptions ?? (metricsLoading ? "…" : "—"), iconKey: "usage", accent: "slate" },
    { id: "revenue-impact", label: "Revenue Impact", value: voucherMetrics?.totalDiscountGiven ?? (metricsLoading ? "…" : "—"), valueType: "currencyCompact", iconKey: "impact", accent: "violet" },
  ];
  const updateDraft = (event) => {
    const { name, type, value, checked } = event.target;
    setDraft((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };
  const saveVoucher = async (status) => {
    const code = draft.code.trim().toUpperCase();
    if (!code) return toast.error("Vui lòng nhập mã voucher");
    try {
      const created = await createVoucher({ voucherDraft: { ...draft, code }, storeId: null, status });
      setSelectedId(created?.id || null);
      setActiveTab(status === "ACTIVE" ? "Active" : "Draft");
      setDraft(initialDraft);
      toast.success(`Đã tạo voucher ${code}`);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Không thể tạo voucher");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <PromotionsHeader title="Vouchers & Promotions" description="Quản lý voucher toàn hệ thống." createLabel="Create New Voucher" onCreateVoucher={() => setDraft(initialDraft)} />
        <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
          <PromotionQuickCreateCard title="Create New Voucher" draft={draft} discountTypes={discountTypes} draftButtonLabel="Save as Draft" publishButtonLabel="Publish Voucher" onDraftChange={updateDraft} onSaveDraft={() => saveVoucher("DRAFT")} onPublish={() => saveVoucher("ACTIVE")} isCreating={isPending} />
          <div className="space-y-4">
            <PromotionStatsGrid metrics={metrics} />
            {metricsError && <p className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">Không tải được thống kê voucher từ máy chủ.</p>}
            <PromotionCampaignList title="Recent Promotions" tabs={tabs} activeTab={activeTab} promotions={visiblePromotions} viewAllLabel={isLoading ? "Loading..." : "View All Promotions"} emptyMessage={vouchersError ? "Không tải được voucher từ máy chủ." : isLoading ? "Đang tải voucher..." : "Chưa có voucher."} selectedPromotionId={selectedId} onTabChange={setActiveTab} onSelectPromotion={setSelectedId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorePromotions;
