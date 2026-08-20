import React from "react";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";

const BankDetailsSection = ({ formData, handleChange }) => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-2xs space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100">
        <AccountBalanceOutlinedIcon className="text-indigo-600" sx={{ fontSize: 22 }} />
        <h3 className="text-base sm:text-lg font-extrabold text-indigo-700 tracking-tight">
          Bank Account Details
        </h3>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Bank Name */}
          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
              BANK NAME <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="bankName"
              value={formData.bankName || ""}
              onChange={handleChange}
              placeholder="e.g., MBBank / Chase Bank"
              required
              className="w-full bg-[#f8f9fc] border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-900 font-medium transition-all"
            />
          </div>

          {/* Account Holder Name */}
          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
              ACCOUNT HOLDER NAME <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="accountHolder"
              value={formData.accountHolder || ""}
              onChange={handleChange}
              placeholder="Exact name on account"
              required
              className="w-full bg-[#f8f9fc] border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-900 font-medium transition-all"
            />
          </div>
        </div>

        {/* Account Number / IBAN */}
        <div>
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
            ACCOUNT NUMBER / IBAN <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="accountNumber"
            value={formData.accountNumber || ""}
            onChange={handleChange}
            placeholder="Enter account number"
            required
            className="w-full bg-[#f8f9fc] border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-900 font-medium transition-all"
          />
        </div>
      </div>
    </div>
  );
};

export default BankDetailsSection;
