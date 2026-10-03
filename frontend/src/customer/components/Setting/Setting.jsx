import React, { useState, useEffect } from "react";
import SettingSidebar from "./SettingSidebar";
import ProfileForm from "./ProfileForm";
import ApplyStoreManager from "../ApplyStoreManager/ApplyStoreManager";
import { useCurrentUser, useUpdateProfileMutation } from "../../../hooks/useAuthQuery";
import { hasRole, ROLE } from "../../../constants/roles";
import toast from "react-hot-toast";

const defaultUserData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  phonePrefix: "",
  avatarUrl: "",
  isVerified: true,
  // ⭐️ THAY ĐỔI: Thay isManager bằng roles array
  roles: [ROLE.CUSTOMER],
  storeId: null,
};

const Setting = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { data: userData = defaultUserData } = useCurrentUser();
  const { mutateAsync: updateProfileMutate } = useUpdateProfileMutation();

  const handleSaveProfile = async (updatedData) => {
    try {
      await updateProfileMutate({ id: userData?.id, data: updatedData });
      toast.success("Thông tin cá nhân đã được lưu thành công!");
    } catch (error) {
      console.error("Error updating user data:", error);
      toast.error("Cập nhật thông tin thất bại: " + error.message);
    }
  };

  return (
    <div className="bg-[#f8f9fc]/60 min-h-screen py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main 2-Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">

          {/* Left Sidebar Component */}
          <SettingSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            userData={userData}
          />

          {/* Right Main Content Area */}
          <div className="flex-1 space-y-6">
            {/* Header Title & Subtitle */}
            {activeTab !== "apply-store" && (
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  {activeTab === "profile" && "Personal Information"}
                  {activeTab === "security" && "Security & Password"}
                  {activeTab === "addresses" && "Saved Addresses"}
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  {activeTab === "profile" && "Manage your personal details and how we can reach you."}
                  {activeTab === "security" && "Keep your account secure with a strong password."}
                  {activeTab === "addresses" && "Manage your shipping and billing addresses."}
                </p>
              </div>
            )}

            {/* Content Form Component */}
            {activeTab === "profile" && (
              <ProfileForm
                userData={userData}
                onSave={handleSaveProfile}
                onCancel={() => { }}
              />
            )}

            {activeTab === "apply-store" && (
              <ApplyStoreManager />
            )}

            {activeTab === "security" && (
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-2xs text-center py-12">
                <p className="text-gray-500 font-medium text-sm">Security settings configuration area.</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default Setting;
