import React, { useState, useRef, useEffect } from "react";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";

const ProfileForm = ({ userData, onSave, onCancel }) => {
  const [formData, setFormData] = useState(userData);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setFormData(userData);
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 800 * 1024) {
        alert("Kích thước ảnh vượt quá 800KB. Vui lòng chọn ảnh nhỏ hơn.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setFormData((prev) => ({
          ...prev,
          avatarUrl: uploadEvent.target?.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setFormData((prev) => ({
      ...prev,
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleCancelForm = () => {
    setFormData(userData);
    if (onCancel) onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-2xs space-y-8">
      {/* Section 1: Profile Picture */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-8 border-b border-gray-100">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-indigo-50 shrink-0 border border-gray-100 shadow-2xs">
          <img
            src={formData.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop"}
            alt="Profile Avatar"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-3">
          <h3 className="text-base font-bold text-gray-900">
            Profile Picture
          </h3>
          <p className="text-xs text-gray-400 font-medium">
            JPG, GIF or PNG. Max size of 800K
          </p>

          <div className="flex items-center gap-3 pt-1">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Upload New
            </button>
            <button
              type="button"
              onClick={handleRemoveAvatar}
              className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors cursor-pointer"
            >
              Remove
            </button>
          </div>
        </div>
      </div>

      {/* Section 2: Form Inputs */}
      <div className="space-y-6">
        {/* First Name & Last Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
              FIRST NAME
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName || ""}
              onChange={handleChange}
              placeholder="First Name"
              className="w-full bg-[#f8f9fc] border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-900 font-medium transition-all"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
              LAST NAME
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName || ""}
              onChange={handleChange}
              placeholder="Last Name"
              className="w-full bg-[#f8f9fc] border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-900 font-medium transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
              CITY
            </label>
            <input
              type="text"
              name="city"
              value={formData.city || ""}
              onChange={handleChange}
              placeholder="City"
              className="w-full bg-[#f8f9fc] border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-900 font-medium transition-all"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
              DISTRICT
            </label>
            <input
              type="text"
              name="district"
              value={formData.district || ""}
              onChange={handleChange}
              placeholder="District"
              className="w-full bg-[#f8f9fc] border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-900 font-medium transition-all"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              SPECIFIC ADDRESS
            </label>
          </div>
          <textarea
            type="textarea"
            name="specificAddress"
            value={formData.specificAddress || ""}
            onChange={handleChange}
            placeholder="Specific Address"
            className="w-full bg-indigo-50/40 border border-indigo-100 focus:outline-none rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-900 font-medium transition-all"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              EMAIL
            </label>
            {formData.isVerified !== false && (
              <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider">
                <CheckCircleOutlinedIcon sx={{ fontSize: 12 }} />
                <span>VERIFIED</span>
              </span>
            )}
          </div>
          <input
            type="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            placeholder="name@example.com"
            className="w-full bg-indigo-50/40 border border-indigo-100 focus:outline-none rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-900 font-medium transition-all"
          />
          <p className="text-[11px] text-gray-400 mt-1.5">
            To change your email address, please contact support.
          </p>
        </div>

        {/* Phone Number */}
        <div>
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
            PHONE NUMBER
          </label>
          <div className="flex items-center gap-2">
            <select
              name="phonePrefix"
              value={formData.phonePrefix || "+1"}
              onChange={handleChange}
              className="bg-[#f8f9fc] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-3 py-3 text-xs sm:text-sm text-gray-700 font-bold transition-all cursor-pointer shrink-0"
            >
              <option value="+1">+1</option>
              <option value="+84">+84</option>
              <option value="+44">+44</option>
              <option value="+81">+81</option>
            </select>
            <input
              type="tel"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              placeholder="(555) 123-4567"
              className="flex-1 bg-[#f8f9fc] border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-900 font-medium transition-all"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
        <button
          type="button"
          onClick={handleCancelForm}
          className="px-6 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-indigo-500/25 transition-all cursor-pointer"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
