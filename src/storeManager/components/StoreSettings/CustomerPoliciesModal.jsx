import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import AssignmentReturnOutlinedIcon from "@mui/icons-material/AssignmentReturnOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";

export default function CustomerPoliciesModal({
  isOpen,
  onClose,
  initialPolicies,
  onSave,
}) {
  const [policies, setPolicies] = useState(initialPolicies || {});
  const [activeTab, setActiveTab] = useState("returns"); // "returns" | "shipping" | "warranty"

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPolicies((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSave(policies);
    onClose();
  };

  const tabs = [
    {
      id: "returns",
      label: "Return & Refund",
      icon: <AssignmentReturnOutlinedIcon sx={{ fontSize: 18 }} />,
    },
    {
      id: "shipping",
      label: "Shipping & Delivery",
      icon: <LocalShippingOutlinedIcon sx={{ fontSize: 18 }} />,
    },
    {
      id: "warranty",
      label: "Warranty & Privacy",
      icon: <ShieldOutlinedIcon sx={{ fontSize: 18 }} />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 sm:px-8">
          <div>
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
              Customer Store Policies
            </h2>
            <p className="text-xs text-slate-500 mt-1 sm:text-sm">
              Define transparent store rules and warranties for your shoppers.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <CloseIcon sx={{ fontSize: 20 }} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 px-6 sm:px-8 bg-slate-50/50">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 border-b-2 py-3.5 px-4 text-xs sm:text-sm font-semibold transition ${
                  isActive
                    ? "border-indigo-600 text-indigo-600 bg-white"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleFormSubmit}>
          <div className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto space-y-5">
            {/* Returns Tab */}
            {activeTab === "returns" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Return Window (Days)
                    </label>
                    <input
                      type="number"
                      name="returnWindowDays"
                      min="0"
                      max="180"
                      value={policies.returnWindowDays || 30}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-800 focus:bg-white focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Restocking Fee (%)
                    </label>
                    <input
                      type="number"
                      name="restockingFee"
                      min="0"
                      max="50"
                      value={policies.restockingFee || 0}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-800 focus:bg-white focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <input
                    type="checkbox"
                    id="freeReturns"
                    name="freeReturns"
                    checked={!!policies.freeReturns}
                    onChange={handleChange}
                    className="h-4 w-4 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label
                    htmlFor="freeReturns"
                    className="text-sm font-medium text-slate-700 select-none cursor-pointer"
                  >
                    Provide 100% Free Return Shipping for customers
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Return Policy Details
                  </label>
                  <textarea
                    rows={4}
                    name="returnPolicyText"
                    value={policies.returnPolicyText || ""}
                    onChange={handleChange}
                    placeholder="Describe specific conditions for returned products..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-800 focus:bg-white focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>
            )}

            {/* Shipping Tab */}
            {activeTab === "shipping" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Order Processing & Dispatch Policy
                  </label>
                  <textarea
                    rows={5}
                    name="shippingPolicyText"
                    value={policies.shippingPolicyText || ""}
                    onChange={handleChange}
                    placeholder="Outline processing timeframes, carriers, and international shipping options..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-800 focus:bg-white focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
                <div className="rounded-xl bg-indigo-50/70 p-4 border border-indigo-100 text-xs text-indigo-900 leading-relaxed">
                  💡 <strong>Tip:</strong> Clearly stating dispatch times helps reduce customer inquiries regarding order status.
                </div>
              </div>
            )}

            {/* Warranty Tab */}
            {activeTab === "warranty" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Default Warranty Period (Months)
                  </label>
                  <input
                    type="number"
                    name="warrantyMonths"
                    min="0"
                    max="60"
                    value={policies.warrantyMonths || 12}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-800 focus:bg-white focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Privacy & Data Protection Notice
                  </label>
                  <textarea
                    rows={4}
                    name="privacyPolicyText"
                    value={policies.privacyPolicyText || ""}
                    onChange={handleChange}
                    placeholder="Specify how customer information is handled and protected..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-800 focus:bg-white focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4 sm:px-8 bg-slate-50/50">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
            >
              <CheckCircleOutlinedIcon sx={{ fontSize: 18 }} />
              Apply Policies
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
