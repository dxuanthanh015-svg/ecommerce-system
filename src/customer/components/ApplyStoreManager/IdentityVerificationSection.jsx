import React, { useRef } from "react";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";

const IdentityVerificationSection = ({ formData, handleChange, handleFileChange }) => {
  const fileInputRef = useRef(null);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-2xs space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100">
        <ShieldOutlinedIcon className="text-indigo-600" sx={{ fontSize: 22 }} />
        <h3 className="text-base sm:text-lg font-extrabold text-indigo-700 tracking-tight">
          Identity Verification
        </h3>
      </div>

      <div className="space-y-5">
        {/* ID Card / Passport Number */}
        <div>
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
            ID CARD / PASSPORT NUMBER <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="idCardNumber"
            value={formData.idCardNumber || ""}
            onChange={handleChange}
            placeholder="Enter document number"
            required
            className="w-full bg-[#f8f9fc] border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-900 font-medium transition-all"
          />
        </div>

        {/* Upload Identity Document Area */}
        <div>
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
            UPLOAD IDENTITY DOCUMENT <span className="text-rose-500">*</span>
          </label>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,.pdf"
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-[#f8f9fc] hover:bg-indigo-50/40 border-2 border-dashed border-gray-200 hover:border-indigo-400 rounded-2xl p-8 text-center transition-all cursor-pointer group flex flex-col items-center justify-center gap-2"
          >
            <div className="w-12 h-12 rounded-full bg-white text-indigo-600 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <CloudUploadOutlinedIcon sx={{ fontSize: 24 }} />
            </div>

            {formData.documentFileName ? (
              <div className="text-xs font-bold text-indigo-700">
                📄 {formData.documentFileName}
              </div>
            ) : (
              <>
                <p className="text-xs sm:text-sm font-bold text-gray-800">
                  Click to upload or drag and drop
                </p>
                <p className="text-[11px] text-gray-400 font-medium">
                  SVG, PNG, JPG or PDF (max. 5MB)
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdentityVerificationSection;
