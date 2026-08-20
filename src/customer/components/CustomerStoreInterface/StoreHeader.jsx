import React, { useState } from "react";
import { Avatar, Rating } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import StarIcon from "@mui/icons-material/Star";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

const StoreHeader = ({ storeData, totalProducts }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(1280);

  const handleToggleFollow = () => {
    setIsFollowing((prev) => !prev);
    setFollowersCount((prev) => (isFollowing ? prev - 1 : prev + 1));
  };

  const handleChat = () => {
    alert(`Đã mở cửa sổ trò chuyện với gian hàng "${storeData?.name}"!`);
  };

  if (!storeData) return null;

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-md mb-8">
      {/* Cover Banner */}
      <div className="h-44 sm:h-56 w-full relative bg-gradient-to-r from-indigo-900 via-indigo-700 to-purple-800">
        <img
          src={storeData.imageUrl || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop"}
          alt="Store Banner"
          className="w-full h-full object-cover opacity-35 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
      </div>

      {/* Main Store Identity & Info Card */}
      <div className="relative px-6 sm:px-8 pb-7 -mt-16 sm:-mt-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">

          {/* Avatar + Store Basic Details */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            <Avatar
              src={storeData.imageUrl}
              alt={storeData.name}
              sx={{ width: { xs: 90, sm: 110 }, height: { xs: 90, sm: 110 }, bgcolor: "#4f46e5" }}
              className="rounded-3xl ring-4 ring-white shadow-xl border border-gray-100 shrink-0"
            >
              {storeData.name?.charAt(0).toUpperCase()}
            </Avatar>

            <div className="space-y-1.5 pt-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {storeData.name}
                </h1>
                <span className="bg-indigo-100 text-indigo-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider">
                  <VerifiedIcon sx={{ fontSize: 13 }} />
                  Official Store
                </span>
              </div>

              <p className="text-xs text-white font-medium">
                Chủ sở hữu: <strong className="text-white font-bold">{storeData.owner || "NexCart Partner"}</strong>
              </p>

              {/* Rating & Followers info */}
              <div className="flex items-center gap-3 text-xs flex-wrap pt-1">
                <div className="flex items-center gap-1 font-bold text-gray-900">
                  <Rating value={storeData.rating || 4.9} precision={0.1} readOnly size="small" sx={{ color: "#6366f1" }} />
                  <span>{storeData.rating || 4.9}</span>
                  <span className="text-gray-400 font-normal">(150+ đánh giá)</span>
                </div>
                <span className="text-gray-300">•</span>
                <span className="font-semibold text-gray-600">
                  <strong className="text-gray-900 font-bold">{followersCount.toLocaleString()}</strong> Người theo dõi
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleToggleFollow}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-sm ${isFollowing
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20"
                }`}
            >
              {isFollowing ? (
                <>
                  <CheckIcon sx={{ fontSize: 16 }} />
                  <span>Đã Theo Dõi</span>
                </>
              ) : (
                <>
                  <AddIcon sx={{ fontSize: 16 }} />
                  <span>Theo Dõi Shop</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleChat}
              className="flex items-center gap-2 px-5 py-3 bg-white hover:bg-indigo-50/60 border border-indigo-200 text-indigo-700 text-xs font-bold rounded-2xl transition-all cursor-pointer"
            >
              <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: 18 }} />
              <span>Chat Với Shop</span>
            </button>
          </div>

        </div>

        {/* Detailed Store Metadata Grid */}
        <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center gap-3 p-3 bg-[#f8f9fc] rounded-2xl border border-gray-100/80">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Inventory2OutlinedIcon sx={{ fontSize: 18 }} />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">SẢN PHẨM</span>
              <span className="font-extrabold text-gray-900 truncate block">{totalProducts || 10} Sản phẩm</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-[#f8f9fc] rounded-2xl border border-gray-100/80">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <StarIcon sx={{ fontSize: 18 }} />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">ĐÁNH GIÁ</span>
              <span className="font-extrabold text-gray-900 truncate block">{storeData.rating || 4.9} / 5.0 ⭐</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-[#f8f9fc] rounded-2xl border border-gray-100/80">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <PhoneOutlinedIcon sx={{ fontSize: 18 }} />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">HOTLINE</span>
              <span className="font-extrabold text-gray-900 truncate block">{storeData.phone || "0987654321"}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-[#f8f9fc] rounded-2xl border border-gray-100/80">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <LocationOnOutlinedIcon sx={{ fontSize: 18 }} />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">ĐỊA CHỈ</span>
              <span className="font-bold text-gray-900 truncate block" title={storeData.address}>
                {storeData.address || "New York"}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StoreHeader;
