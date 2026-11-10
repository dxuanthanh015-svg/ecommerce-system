import React from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Rating } from "@mui/material";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

const StoreInformation = ({ storeData, storeProductsCount }) => {
  const navigate = useNavigate();
  if (!storeData) return null;

  const storeRating = Number(storeData.rating) || 0;
  const storeReviewCount = Number(storeData.reviewCount) || 0;

  const handleVisitStore = () => {
    if (storeData.id) navigate(`/store/${storeData.id}`);
  };

  const handleChat = () => {
    if (storeData.id) {
      navigate(`/messages?storeId=${encodeURIComponent(storeData.id)}`, { state: { store: storeData } });
    }
  };

  return (
    <div className="my-6 rounded-3xl border border-indigo-100/80 bg-gradient-to-r from-indigo-50/50 via-white to-purple-50/40 p-4 shadow-xs transition-all hover:shadow-md sm:my-7 sm:p-5">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center sm:gap-5">
        <div className="flex min-w-0 items-center gap-4">
          <div className="relative shrink-0">
            <Avatar
              src={storeData.logoUrl || undefined}
              alt={storeData.name || "Cửa hàng"}
              sx={{ width: 60, height: 60, bgcolor: "#4f46e5", fontSize: 22, fontWeight: 900 }}
              className="rounded-2xl border border-indigo-100 shadow-md ring-4 ring-indigo-50"
            >
              {(storeData.name || "S").charAt(0).toUpperCase()}
            </Avatar>
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
            </span>
          </div>

          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-1.5">
              <h2 className="truncate text-base font-extrabold tracking-tight text-gray-900 sm:text-lg">
                {storeData.name}
              </h2>
              <VerifiedIcon sx={{ fontSize: 17 }} className="shrink-0 text-indigo-600" />
            </div>
            <p className="flex flex-wrap items-center gap-x-1 text-xs font-semibold text-gray-500">
              <span>Được quản lý bởi:</span>
              <span className="font-bold text-gray-800">{storeData.ownerName || "Cửa hàng"}</span>
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-0.5 sm:gap-3">
              <div className="flex items-center gap-1 rounded-lg border border-amber-200/60 bg-amber-50 px-2 py-0.5">
                <Rating value={storeRating} precision={0.1} readOnly size="small" sx={{ fontSize: 13, color: "#f59e0b" }} />
                <span className="ml-1 text-xs font-extrabold text-amber-700">{storeRating.toFixed(1)}</span>
              </div>
              <span className="text-[11px] text-gray-500">({storeReviewCount} đánh giá)</span>
              {storeData.status === "ACTIVE" && (
                <span className="rounded-lg border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600">
                  Đang hoạt động
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 rounded-2xl border border-gray-100 bg-white/80 px-3 py-2.5 shadow-2xs backdrop-blur-xs sm:gap-4 sm:px-4 lg:min-w-[330px]">
          <div className="text-center">
            <div className="mb-0.5 flex items-center justify-center gap-1 text-gray-400">
              <Inventory2OutlinedIcon sx={{ fontSize: 14 }} />
              <span className="text-[9px] font-bold uppercase tracking-wider sm:text-[10px]">Sản phẩm</span>
            </div>
            <p className="text-sm font-extrabold text-gray-900">
              {storeProductsCount ?? storeData.productCount ?? 0}
            </p>
          </div>
          <div className="min-w-0 border-x border-gray-100 px-2 text-center">
            <div className="mb-0.5 flex items-center justify-center gap-1 text-gray-400">
              <LocationOnOutlinedIcon sx={{ fontSize: 14 }} />
              <span className="text-[9px] font-bold uppercase tracking-wider sm:text-[10px]">Khu vực</span>
            </div>
            <p className="line-clamp-1 text-[11px] font-bold text-gray-800">{storeData.address || "Chưa cập nhật"}</p>
          </div>
          <div className="min-w-0 text-center">
            <div className="mb-0.5 flex items-center justify-center gap-1 text-gray-400">
              <PhoneOutlinedIcon sx={{ fontSize: 14 }} />
              <span className="text-[9px] font-bold uppercase tracking-wider sm:text-[10px]">Hỗ trợ</span>
            </div>
            <p className="line-clamp-1 text-[11px] font-bold text-gray-800">{storeData.phone || "Chưa cập nhật"}</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:self-center">
          <button
            type="button"
            onClick={handleChat}
            className="flex-1 cursor-pointer rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-bold text-gray-700 shadow-2xs transition-all hover:bg-gray-50 active:scale-95 sm:flex-none sm:px-4"
          >
            <span className="flex items-center justify-center gap-1.5">
              <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: 16 }} /> Chat ngay
            </span>
          </button>
          <button
            type="button"
            onClick={handleVisitStore}
            className="flex-1 cursor-pointer rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/20 transition-all hover:bg-indigo-700 active:scale-95 sm:flex-none sm:px-5"
          >
            <span className="flex items-center justify-center gap-1.5">
              <StorefrontOutlinedIcon sx={{ fontSize: 16 }} /> Xem Shop
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreInformation;
