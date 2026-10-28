import React from "react";
import { Avatar, Rating } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import StarIcon from "@mui/icons-material/Star";

const StoreHeader = ({ storeData, totalProducts = 0 }) => {
  if (!storeData) return null;

  const rating = Number(storeData.rating) || 0;
  const reviewCount = Number(storeData.reviewCount) || 0;
  const joinedDate = storeData.createdAt
    ? new Date(storeData.createdAt).toLocaleDateString("vi-VN", { month: "long", year: "numeric" })
    : null;

  return (
    <section className="mb-8 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      <div className="relative h-44 bg-gradient-to-r from-indigo-950 via-indigo-800 to-violet-700 sm:h-60">
        {storeData.bannerUrl && (
          <img
            src={storeData.bannerUrl}
            alt={`${storeData.name} banner`}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/75 via-gray-950/30 to-transparent" />
        <div className="absolute bottom-5 left-6 right-6 text-white sm:bottom-7 sm:left-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/75">Cửa hàng chính thức</p>
          <p className="mt-1 text-sm text-white/90">Khám phá sản phẩm và thông tin cửa hàng</p>
        </div>
      </div>

      <div className="px-5 pb-6 sm:px-8">
        <div className="-mt-10 flex flex-col gap-4 sm:-mt-12 sm:flex-row sm:items-end">
          <Avatar
            src={storeData.logoUrl || undefined}
            alt={storeData.name}
            sx={{ width: { xs: 88, sm: 104 }, height: { xs: 88, sm: 104 }, bgcolor: "#4f46e5", fontSize: 32 }}
            className="shrink-0 border-4 border-white shadow-lg"
          >
            {storeData.name?.trim()?.charAt(0)?.toUpperCase() || "S"}
          </Avatar>

          <div className="min-w-0 flex-1 pb-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-gray-950 sm:text-3xl">{storeData.name}</h1>
              {storeData.status === "ACTIVE" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-indigo-700">
                  <VerifiedIcon sx={{ fontSize: 14 }} /> Đã xác minh
                </span>
              )}
            </div>
            {storeData.ownerName && <p className="mt-1 text-sm text-gray-500">Chủ cửa hàng: {storeData.ownerName}</p>}
          </div>
        </div>

        {storeData.description && (
          <p className="mt-5 max-w-4xl whitespace-pre-line text-sm leading-6 text-gray-600">{storeData.description}</p>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3 border-t border-gray-100 pt-5 sm:grid-cols-2 lg:grid-cols-4">
          <InfoCard icon={<Inventory2OutlinedIcon sx={{ fontSize: 18 }} />} label="Sản phẩm" value={`${totalProducts} sản phẩm`} tone="indigo" />
          <InfoCard
            icon={<StarIcon sx={{ fontSize: 18 }} />}
            label="Đánh giá"
            value={`${rating.toFixed(1)} / 5`}
            description={`${reviewCount} đánh giá`}
            rating={rating}
            tone="amber"
          />
          {storeData.address && <InfoCard icon={<LocationOnOutlinedIcon sx={{ fontSize: 18 }} />} label="Địa chỉ" value={storeData.address} tone="purple" />}
          {storeData.phone && <InfoCard icon={<PhoneOutlinedIcon sx={{ fontSize: 18 }} />} label="Liên hệ cửa hàng" value={storeData.phone} tone="emerald" />}
          {joinedDate && <InfoCard icon={<VerifiedIcon sx={{ fontSize: 18 }} />} label="Hoạt động từ" value={joinedDate} tone="blue" />}
        </div>
      </div>
    </section>
  );
};

const tones = {
  indigo: "bg-indigo-50 text-indigo-600",
  amber: "bg-amber-50 text-amber-600",
  purple: "bg-purple-50 text-purple-600",
  emerald: "bg-emerald-50 text-emerald-600",
  blue: "bg-blue-50 text-blue-600",
};

function InfoCard({ icon, label, value, description, rating, tone }) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50/80 p-3">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>{icon}</div>
      <div className="min-w-0">
        <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</span>
        <span className="block truncate text-sm font-bold text-gray-900" title={value}>{value}</span>
        {rating != null && <Rating value={rating} precision={0.1} readOnly size="small" sx={{ color: "#d97706", mt: 0.25 }} />}
        {description && <span className="block text-[10px] text-gray-500">{description}</span>}
      </div>
    </div>
  );
}

export default StoreHeader;
