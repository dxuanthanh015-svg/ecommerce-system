import React from "react";
import PromotionCampaignListItem from "./PromotionCampaignListItem";

const PromotionCampaignList = ({
  title,
  tabs,
  activeTab,
  promotions,
  viewAllLabel,
  selectedPromotionId,
  onTabChange,
  onSelectPromotion,
}) => {
  return (
    <section className="rounded-2xl border border-[#e5e7f2] bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                activeTab === tab
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div>
        {promotions.length > 0 ? (
          promotions.map((promotion) => (
            <PromotionCampaignListItem
              key={promotion.id}
              promotion={promotion}
              isSelected={promotion.id === selectedPromotionId}
              onSelect={onSelectPromotion}
            />
          ))
        ) : (
          <div className="px-6 py-10 text-center">
            <p className="text-sm font-medium text-slate-500">
              No promotions match this filter yet.
            </p>
          </div>
        )}
      </div>

      <div className="border-t border-slate-100 px-5 py-4 text-center">
        <button
          type="button"
          className="text-sm font-semibold text-indigo-700 transition hover:text-indigo-800"
        >
          {viewAllLabel}
        </button>
      </div>
    </section>
  );
};

export default PromotionCampaignList;
