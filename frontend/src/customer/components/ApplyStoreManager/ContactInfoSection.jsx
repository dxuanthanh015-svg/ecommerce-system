import React from "react";
import ContactMailOutlinedIcon from "@mui/icons-material/ContactMailOutlined";

const ContactInfoSection = ({ formData, handleChange }) => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-2xs space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100">
        <ContactMailOutlinedIcon className="text-indigo-600" sx={{ fontSize: 22 }} />
        <h3 className="text-base sm:text-lg font-extrabold text-indigo-700 tracking-tight">
          Contact Information
        </h3>
      </div>

      {/* Grid Fields */}
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Business Email */}
          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
              BUSINESS EMAIL <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              name="businessEmail"
              value={formData.businessEmail || ""}
              onChange={handleChange}
              placeholder="contact@yourshop.com"
              required
              className="w-full bg-[#f8f9fc] border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-900 font-medium transition-all"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
              PHONE NUMBER <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              required
              className="w-full bg-[#f8f9fc] border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-900 font-medium transition-all"
            />
          </div>
        </div>

        {/* Pick-up Address */}
        <div>
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
            PICK-UP ADDRESS <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={2}
            name="pickupAddress"
            value={formData.pickupAddress || ""}
            onChange={handleChange}
            placeholder="Full street address for courier pick-ups"
            required
            className="w-full bg-[#f8f9fc] border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-900 font-medium transition-all"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactInfoSection;
