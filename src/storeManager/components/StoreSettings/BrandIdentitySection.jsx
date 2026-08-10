import React from "react";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import StoreSettingsField from "./StoreSettingsField";

export default function BrandIdentitySection({ values, onChange }) {
  return (
    <section className="overflow-hidden rounded-3xl border border-[#e5e8f2] bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
      <div className="relative h-72 overflow-hidden bg-[#ece9e2]">
        <img
          src={values.bannerImage}
          alt="Minimal home decor storefront banner"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
      </div>

      <div className="relative px-6 pb-7 pt-20 sm:px-8">
        <div className="absolute -top-12 left-6 sm:-top-14 sm:left-8">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-[6px] border-white bg-slate-50 shadow-lg sm:h-28 sm:w-28">
              <img
                src={values.logoImage}
                alt="Store logo"
                className="h-14 w-14 object-contain sm:h-16 sm:w-16"
              />
            </div>
            <button
              type="button"
              className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md transition hover:bg-slate-50"
              aria-label="Edit brand logo"
            >
              <BorderColorOutlinedIcon sx={{ fontSize: 17 }} />
            </button>
          </div>
        </div>

        <div className="border-b border-[#eceff7] pb-5">
          <h2 className="text-[32px] font-bold tracking-tight text-slate-900">
            Brand Identity
          </h2>
          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            This information is displayed publicly on your storefront.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
          <StoreSettingsField
            id="storeName"
            label="Store Name"
            name="storeName"
            value={values.storeName}
            onChange={onChange}
          />

          <StoreSettingsField
            id="contactEmail"
            label="Public Contact Email"
            name="contactEmail"
            type="email"
            value={values.contactEmail}
            onChange={onChange}
          />

          <div className="md:col-span-2">
            <StoreSettingsField
              id="bio"
              label="Store Description (Bio)"
              name="bio"
              value={values.bio}
              onChange={onChange}
              textarea
            />
          </div>
        </div>
      </div>
    </section>
  );
}
