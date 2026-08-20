import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Avatar, Rating } from "@mui/material";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import store_manager_mock_data from "../../../Data/store-manager_mock_data";
import { product_mock_data } from "../../../Data/product_mock_data";

const StoreInformation = () => {
  const navigate = useNavigate();
  const { productId } = useParams();

  const allProducts = JSON.parse(localStorage.getItem("products")) || product_mock_data;
  const product = allProducts.find((item) => String(item.id) === String(productId));

  const allStores = JSON.parse(localStorage.getItem("allStores")) || JSON.parse(localStorage.getItem("stores")) || store_manager_mock_data;

  // Find store data from stores based on product.id_store
  const storeData = allStores.find(
    (item) => String(item.id) === String(product?.id_store || product?.storeId)
  ) || allStores[0];

  // Calculate total products belonging to this store
  const storeProductsCount = allProducts.filter(
    (item) => String(item.id_store || item.storeId) === String(storeData?.id)
  ).length;

  const handleVisitStore = () => {
    if (storeData?.id) {
      navigate(`/store/${storeData.id}`);
    }
  };

  const handleChat = () => {
    alert(`Đã kết nối trò chuyện với gian hàng "${storeData?.name}"!`);
  };

  if (!storeData) return null;

  return (
    <div className="bg-gradient-to-r from-indigo-50/50 via-white to-purple-50/40 border border-indigo-100/80 rounded-3xl p-6 sm:p-7 shadow-xs my-8 transition-all hover:shadow-md">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Left: Store Identity & Rating */}
        <div className="flex items-center gap-5">
          {/* Store Avatar / Image */}
          <div className="relative shrink-0">
            <Avatar
              sx={{ width: 72, height: 72, bgcolor: "#4f46e5" }}
              className="rounded-2xl shadow-md ring-4 ring-indigo-50 border border-indigo-100"
            >
              {storeData.imageUrl ? (
                <img
                  src={storeData.imageUrl}
                  alt={storeData.name}
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <span className="text-2xl font-bold text-white">
                  {storeData.name?.charAt(0).toUpperCase()}
                </span>
              )}
            </Avatar>
            <span className="absolute -bottom-1 -right-1 bg-emerald-500 w-4 h-4 rounded-full border-2 border-white" title="Online Now" />
          </div>

          {/* Store Details */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">
                {storeData.name}
              </h2>
              <span className="bg-indigo-100 text-indigo-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider">
                <VerifiedIcon sx={{ fontSize: 13 }} />
                Official Store
              </span>
            </div>

            <p className="text-xs text-gray-500 font-medium">
              Chủ gian hàng: <strong className="text-gray-800 font-bold">{storeData.owner || "Đặng Xuân Thành"}</strong>
            </p>

            {/* Rating Stars & Count */}
            <div className="flex items-center gap-2 pt-0.5">
              <Rating
                value={storeData.rating || 4.9}
                precision={0.1}
                readOnly
                size="small"
                sx={{ color: "#6366f1" }}
              />
              <span className="text-xs font-bold text-gray-900">
                {storeData.rating || 4.9}
              </span>
              <span className="text-xs text-gray-400 font-medium">
                (120+ Đánh giá)
              </span>
            </div>
          </div>
        </div>

        {/* Middle Meta Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border-y lg:border-y-0 lg:border-x border-gray-200/80 py-4 lg:py-0 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Inventory2OutlinedIcon sx={{ fontSize: 18 }} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">SẢN PHẨM</span>
              <span className="text-xs font-extrabold text-gray-900">{storeProductsCount || 10} món</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <PhoneOutlinedIcon sx={{ fontSize: 18 }} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">HOTLINE</span>
              <span className="text-xs font-extrabold text-gray-900">{storeData.phone || "0987654321"}</span>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <LocationOnOutlinedIcon sx={{ fontSize: 18 }} />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">ĐỊA CHỈ</span>
              <span className="text-xs font-bold text-gray-900 truncate block max-w-[140px]" title={storeData.address}>
                {storeData.address || "New York"}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex sm:flex-row lg:flex-col gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleVisitStore}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-sm hover:shadow-indigo-500/25 transition-all cursor-pointer"
          >
            <StorefrontOutlinedIcon sx={{ fontSize: 18 }} />
            <span>Xem Shop</span>
          </button>

          <button
            type="button"
            onClick={handleChat}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-white hover:bg-indigo-50/50 border border-indigo-200 text-indigo-700 text-xs font-bold px-5 py-3 rounded-2xl transition-all cursor-pointer"
          >
            <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: 18 }} />
            <span>Chat Ngay</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default StoreInformation;