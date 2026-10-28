import React, { useState } from "react";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import StoreSettingsField from "./StoreSettingsField";

export default function BrandIdentitySection({ values, onChange }) {
  const [showBannerUrlInput, setShowBannerUrlInput] = useState(false);

  return (
    <section className="overflow-hidden rounded-3xl border border-[#e5e8f2] bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
      {/* Banner Area */}
      <div className="group relative h-64 sm:h-72 overflow-hidden bg-[#ece9e2]">
        <img
          src={values.bannerImage}
          alt="Storefront banner"
          onError={(event) => { event.currentTarget.src = "/nexCart.svg"; }}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.01]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />

        {/* Change Banner Controls */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowBannerUrlInput((prev) => !prev)}
            className="flex items-center gap-1.5 rounded-xl bg-white/90 px-3.5 py-2 text-xs font-semibold text-slate-800 shadow-md backdrop-blur-xs transition hover:bg-white hover:text-indigo-600"
          >
            <LinkOutlinedIcon sx={{ fontSize: 16 }} />
            Change Banner URL
          </button>
        </div>

        {/* Optional Banner URL inline bar */}
        {showBannerUrlInput && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 rounded-2xl bg-white/95 p-3 shadow-xl backdrop-blur-md border border-slate-200">
            <div className="flex gap-2">
              <input
                type="url"
                name="bannerImage"
                value={values.bannerImage || ""}
                onChange={onChange}
                placeholder="Paste banner image URL here..."
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-hidden focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowBannerUrlInput(false)}
                className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-700"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Form Area */}
      <div className="relative px-6 pb-8 pt-20 sm:px-8">
        {/* Logo Avatar */}
        <div className="absolute -top-14 left-6 sm:-top-16 sm:left-8">
          <div className="relative group">
            <div className="flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center overflow-hidden rounded-2xl border-[6px] border-white bg-slate-50 shadow-xl">
              <img
                src={values.logoImage}
                alt="Store logo"
                onError={(event) => { event.currentTarget.src = "/nexCart.svg"; }}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="border-b border-[#eceff7] pb-5">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Brand Identity
            </h2>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              Public Profile
            </span>
          </div>
          <p className="mt-1.5 text-xs text-slate-500 sm:text-sm">
            This information is displayed publicly to customers on your storefront and order receipts.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="logoImage" className="mb-1.5 block text-xs font-bold text-slate-700">
              Store avatar image URL
            </label>
            <input
              id="logoImage"
              type="url"
              name="logoImage"
              value={values.logoImage || ""}
              onChange={onChange}
              placeholder="https://example.com/store-avatar.jpg"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-100"
            />
            <p className="mt-1 text-xs text-slate-500">Dán URL ảnh công khai; ảnh sẽ được xem trước ở avatar phía trên.</p>
          </div>

          <StoreSettingsField
            id="storeName"
            label="Store Name"
            name="storeName"
            value={values.storeName || ""}
            onChange={onChange}
            placeholder="e.g. Aura Minimalist Goods"
          />

          <StoreSettingsField
            id="contactEmail"
            label="Public Contact Email"
            name="contactEmail"
            type="email"
            value={values.contactEmail || ""}
            onChange={onChange}
            placeholder="contact@yourstore.com"
          />

          <StoreSettingsField
            id="phone"
            label="Customer Support Hotline"
            name="phone"
            type="tel"
            value={values.phone || ""}
            onChange={onChange}
            placeholder="+1 (555) 000-0000"
          />

          <StoreSettingsField
            id="category"
            label="Primary Business Category"
            name="category"
            value={values.category || ""}
            onChange={onChange}
            placeholder="e.g. Home & Living, Fashion, Tech"
          />

          <div className="md:col-span-2">
            <StoreSettingsField
              id="bio"
              label="Store Description & Bio"
              name="bio"
              value={values.bio || ""}
              onChange={onChange}
              textarea
              placeholder="Tell shoppers about your brand philosophy, quality standards, and story..."
            />
          </div>
        </div>
      </div>
    </section>
  );
}
