import React from "react";
import toast from "react-hot-toast";
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
import { useProducts } from "../../../hooks/useProductQuery";
import { useAllStores } from "../../../hooks/useStoreQuery";

const StoreInformation = ({ storeData: propStoreData, storeProductsCount: propStoreProductsCount }) => {
  const navigate = useNavigate();
  const { productId } = useParams();

  const { data: allProds = product_mock_data } = useProducts();
  const { data: allStores = store_manager_mock_data } = useAllStores();

  const product = allProds.find((item) => String(item.id) === String(productId)) || product_mock_data.find((item) => String(item.id) === String(productId));
  const targetStoreId = String(product?.id_store || product?.storeId || "store-001");
  const storesList = Array.isArray(allStores) && allStores.length > 0 ? allStores : store_manager_mock_data;

  const targetStore =
    propStoreData ||
    storesList.find((item) => String(item.id) === targetStoreId) ||
    store_manager_mock_data.find((item) => String(item.id) === targetStoreId) ||
    storesList[0];

  const storeData = targetStore;
  const storeProductsCount = propStoreProductsCount !== undefined
    ? propStoreProductsCount
    : allProds.filter((item) => String(item.id_store || item.storeId) === String(targetStore?.id)).length;

  const handleVisitStore = () => {
    if (storeData?.id) {
      navigate(`/store/${storeData.id}`);
    }
  };

  const handleChat = () => {
    toast.success(`Đã kết nối trò chuyện với gian hàng "${storeData?.name}"!`);
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
                <span className="text-2xl font-black text-white">
                  {(storeData.name || "S").charAt(0).toUpperCase()}
                </span>
              )}
            </Avatar>
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
            </span>
          </div>

          {/* Store Details */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">
                {storeData.name}
              </h2>
              <VerifiedIcon sx={{ fontSize: 18 }} className="text-indigo-600" />
            </div>

            <p className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
              <span>Được quản lý bởi:</span>
              <span className="font-bold text-gray-800">{storeData.owner}</span>
            </p>

            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/60">
                <Rating
                  value={Number(storeData.rating) || 5.0}
                  precision={0.1}
                  readOnly
                  size="small"
                  sx={{ fontSize: 14, color: "#f59e0b" }}
                />
                <span className="text-xs font-extrabold text-amber-700 ml-1">
                  {Number(storeData.rating || 5.0).toFixed(1)}
                </span>
              </div>
              <span className="text-xs font-medium text-gray-400">•</span>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                Đang online
              </span>
            </div>
          </div>
        </div>

        {/* Center: Quick Store Metrics */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 py-3 px-4 sm:px-6 bg-white/80 backdrop-blur-xs rounded-2xl border border-gray-100 shadow-2xs">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-gray-400 mb-0.5">
              <Inventory2OutlinedIcon sx={{ fontSize: 15 }} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Sản phẩm</span>
            </div>
            <p className="text-sm sm:text-base font-extrabold text-gray-900">
              {storeProductsCount || 12}
            </p>
          </div>

          <div className="text-center border-x border-gray-100 px-2">
            <div className="flex items-center justify-center gap-1 text-gray-400 mb-0.5">
              <LocationOnOutlinedIcon sx={{ fontSize: 15 }} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Khu vực</span>
            </div>
            <p className="text-xs sm:text-xs font-bold text-gray-800 line-clamp-1">
              {storeData.address ? storeData.address.split(",")[0] : "New York"}
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-gray-400 mb-0.5">
              <PhoneOutlinedIcon sx={{ fontSize: 15 }} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Hỗ trợ</span>
            </div>
            <p className="text-xs sm:text-xs font-bold text-gray-800 line-clamp-1">
              {storeData.phone || "24/7"}
            </p>
          </div>
        </div>

        {/* Right: Actions (Visit & Chat) */}
        <div className="flex items-center gap-2.5 sm:self-center">
          <button
            type="button"
            onClick={handleChat}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold rounded-xl shadow-2xs transition-all active:scale-95 cursor-pointer"
          >
            <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: 16 }} />
            <span>Chat ngay</span>
          </button>

          <button
            type="button"
            onClick={handleVisitStore}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-500/20 transition-all active:scale-95 cursor-pointer"
          >
            <StorefrontOutlinedIcon sx={{ fontSize: 16 }} />
            <span>Xem Shop</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default StoreInformation;
