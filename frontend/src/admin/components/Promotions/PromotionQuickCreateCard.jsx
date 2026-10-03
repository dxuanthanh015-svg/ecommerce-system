import React from "react";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";
import PromotionQuickCreateField from "./PromotionQuickCreateField";

const PromotionQuickCreateCard = ({
  title,
  draft,
  discountTypes,
  draftButtonLabel,
  publishButtonLabel,
  onDraftChange,
  onSaveDraft,
  onPublish,
}) => {
  return (
    <section className="rounded-2xl border border-[#e5e7f2] bg-white p-5 shadow-sm">
      <h2 className="text-2xl font-bold tracking-tight text-slate-900">
        {title}
      </h2>
      <div className="mt-4 border-t border-slate-100 pt-4">
        <div className="space-y-4">
          <PromotionQuickCreateField
            label="Voucher Code"
            name="code"
            value={draft.code}
            onChange={onDraftChange}
            placeholder="e.g. SUMMER24"
          />

          <div className="grid grid-cols-[1.15fr_0.85fr] gap-3">
            <PromotionQuickCreateField
              label="Discount Type"
              name="discountType"
              value={draft.discountType}
              onChange={onDraftChange}
              options={discountTypes}
            />

            <PromotionQuickCreateField
              label="Value"
              name="value"
              value={draft.value}
              onChange={onDraftChange}
              type="number"
              placeholder="20"
            />
          </div>

          <div>
            <p className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              Active Dates
            </p>
            <div className="grid items-end gap-2">
              <div>
                <span className="pb-3 text-sm text-slate-400">From</span>
                <PromotionQuickCreateField
                  label=""
                  name="startDate"
                  value={draft.startDate}
                  onChange={onDraftChange}
                  type="date"
                />
              </div>

              <div>
                <span className="pb-3 text-sm text-slate-400">to</span>
                <PromotionQuickCreateField
                  label=""
                  name="endDate"
                  value={draft.endDate}
                  onChange={onDraftChange}
                  type="date"
                />
              </div>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              name="limitPerCustomer"
              checked={draft.limitPerCustomer}
              onChange={onDraftChange}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Limit usage per customer</span>
          </label>
        </div>

        <div className="mt-5 flex flex-col gap-3">
          <button
            type="button"
            onClick={onSaveDraft}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-600 px-4 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
          >
            <SaveOutlinedIcon sx={{ fontSize: 18 }} />
            <span>{draftButtonLabel}</span>
          </button>

          <button
            type="button"
            onClick={onPublish}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            <CampaignRoundedIcon sx={{ fontSize: 18 }} />
            <span>{publishButtonLabel}</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default PromotionQuickCreateCard;
