import React from "react";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";

const MediaSection = ({ mediaImages }) => {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-100 shadow-2xs space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <h2 className="text-base sm:text-lg font-bold text-gray-900">
          Media
        </h2>
        <span className="text-xs font-semibold text-gray-400">
          {mediaImages.length} / 10 images
        </span>
      </div>

      {/* Thumbnail Preview Row */}
      <div className="flex items-center gap-4 overflow-x-auto pb-2">
        {mediaImages.map((img, idx) => (
          <div
            key={img.id || idx}
            className={`relative w-24 h-24 rounded-2xl border bg-gray-50 overflow-hidden shrink-0 ${
              img.isMain ? "border-2 border-indigo-600 bg-indigo-50/20" : "border-gray-200"
            }`}
          >
            {img.isMain && (
              <span className="absolute top-1.5 left-1.5 bg-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded z-10 uppercase">
                Main
              </span>
            )}
            <img src={img.url} alt="Product media" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      {/* Drag and Drop Zone */}
      <div className="border-2 border-dashed border-indigo-200/80 rounded-2xl p-8 text-center bg-[#f8f9fc]/60 hover:bg-indigo-50/20 transition-all cursor-pointer flex flex-col items-center justify-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <CloudUploadOutlinedIcon sx={{ fontSize: 24 }} />
        </div>
        <div>
          <p className="text-xs sm:text-sm font-bold text-gray-900">
            Drag and drop more images here
          </p>
          <p className="text-[11px] text-gray-400 mt-1">
            High quality JPG, PNG or WEBP (max 5MB)
          </p>
        </div>
        <button
          type="button"
          className="border border-gray-300 hover:bg-gray-50 text-gray-800 text-xs font-bold px-4 py-2 rounded-xl bg-white transition-all cursor-pointer shadow-2xs"
        >
          Browse Files
        </button>
      </div>
    </div>
  );
};

export default MediaSection;
