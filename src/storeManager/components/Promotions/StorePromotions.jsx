import React, { useMemo, useState } from "react";
import PromotionsHeader from "./PromotionsHeader";
import PromotionStatsGrid from "./PromotionStatsGrid";
import PromotionQuickCreateCard from "./PromotionQuickCreateCard";
import PromotionCampaignList from "./PromotionCampaignList";
import {
  clonePromotionDraft,
  createPromotionFromDraft,
  createPromotionsPageState,
} from "./promotions.data";
import { filterPromotionsByTab } from "./promotions.utils";

const StorePromotions = () => {
  const [pageState, setPageState] = useState(() => createPromotionsPageState());
  const [activeTab, setActiveTab] = useState(pageState.recentPromotions.tabs[0]);
  const [draft, setDraft] = useState(() => clonePromotionDraft(pageState.quickCreate.form));
  const [selectedPromotionId, setSelectedPromotionId] = useState(
    pageState.recentPromotions.items[0]?.id || null,
  );

  const visiblePromotions = useMemo(
    () => filterPromotionsByTab(pageState.recentPromotions.items, activeTab),
    [pageState.recentPromotions.items, activeTab],
  );

  const updateDraftField = (event) => {
    const { name, type, value, checked } = event.target;
    setDraft((currentDraft) => ({
      ...currentDraft,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetDraft = () => {
    setDraft(clonePromotionDraft(pageState.quickCreate.form));
  };

  const prependPromotion = (status) => {
    const nextPromotion = createPromotionFromDraft(draft, status);

    setPageState((currentState) => ({
      ...currentState,
      recentPromotions: {
        ...currentState.recentPromotions,
        items: [nextPromotion, ...currentState.recentPromotions.items],
      },
    }));

    setSelectedPromotionId(nextPromotion.id);
    setActiveTab(status === "Active" ? "Active" : "Draft");
    resetDraft();
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PromotionsHeader
        title={pageState.header.title}
        description={pageState.header.description}
        createLabel={pageState.header.createLabel}
        onCreateVoucher={resetDraft}
      />

      <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <PromotionQuickCreateCard
          title={pageState.quickCreate.title}
          draft={draft}
          discountTypes={pageState.quickCreate.discountTypes}
          draftButtonLabel={pageState.quickCreate.draftButtonLabel}
          publishButtonLabel={pageState.quickCreate.publishButtonLabel}
          onDraftChange={updateDraftField}
          onSaveDraft={() => prependPromotion("Draft")}
          onPublish={() => prependPromotion("Active")}
        />

        <div className="space-y-4">
          <PromotionStatsGrid metrics={pageState.metrics} />

          <PromotionCampaignList
            title={pageState.recentPromotions.title}
            tabs={pageState.recentPromotions.tabs}
            activeTab={activeTab}
            promotions={visiblePromotions}
            viewAllLabel={pageState.recentPromotions.viewAllLabel}
            selectedPromotionId={selectedPromotionId}
            onTabChange={setActiveTab}
            onSelectPromotion={setSelectedPromotionId}
          />
        </div>
      </div>
    </div>
  );
};

export default StorePromotions;
