import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ShopInfoSection from "./ShopInfoSection";
import ContactInfoSection from "./ContactInfoSection";
import IdentityVerificationSection from "./IdentityVerificationSection";
import BankDetailsSection from "./BankDetailsSection";

const ApplyStoreManager = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem("storeApplication");
    if (saved) return JSON.parse(saved);
    return {
      shopName: "",
      shopDescription: "",
      primaryCategory: "",
      businessEmail: user.email || "",
      phone: user.phone || "",
      pickupAddress: user.specificAddress || "",
      idCardNumber: "",
      documentFileName: "",
      bankName: "",
      accountHolder: user.firstName ? `${user.firstName} ${user.lastName}` : "",
      accountNumber: "",
    };
  });


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, documentFileName: file.name });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.shopName || !formData.businessEmail || !formData.phone || !formData.bankName) {
      alert("Vui lòng điền đầy đủ các thông tin bắt buộc!");
      return;
    }

    const existingStores = JSON.parse(localStorage.getItem("stores")) || [];

    const newStore = {
      id: `store-${Date.now()}`,
      name: formData.shopName,
      owner: `${user.firstName || "NexCart"} ${user.lastName || "Partner"}`,
      email: formData.businessEmail,
      phone: formData.phone,
      address: formData.pickupAddress || "Manhattan, New York",
      category: formData.primaryCategory,
      rating: 5.0,
      imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop",
      bankInfo: {
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        accountName: formData.accountHolder,
        qrCodeUrl: `https://img.vietqr.io/image/${formData.bankName}-${formData.accountNumber}-compact2.png`,
      },
      status: "Approved",
    };
    user.isManager
      ? alert("You are already a store manager")
      : (() => {
        localStorage.setItem("storeApplication", JSON.stringify(formData));
        const allStores = JSON.parse(localStorage.getItem("allStores")) || existingStores;
        const updatedAllStores = [...allStores, newStore];
        localStorage.setItem("allStores", JSON.stringify(updatedAllStores));
        localStorage.setItem("stores", JSON.stringify(updatedAllStores));
        localStorage.setItem("currentStore", JSON.stringify(newStore));
        localStorage.setItem("currentProducts", JSON.stringify([]))

        user.isManager = true;
        user.storeId = newStore.id;
        localStorage.setItem("user", JSON.stringify(user));

        // Initialize orderRevenue in localStorage for the new store (default 0)
        const allStoreRevenue = JSON.parse(localStorage.getItem("allStoreRevenue")) || {};
        allStoreRevenue[newStore.id] = {
          storeId: newStore.id,
          storeName: newStore.name,
          totalRevenue: 0,
          todayRevenue: 0,
          orders: [],
        };
        localStorage.setItem("allStoreRevenue", JSON.stringify(allStoreRevenue));
        localStorage.setItem("orderRevenue", JSON.stringify(allStoreRevenue[newStore.id]));

        // Synchronize isManager and storeId in registeredUsers array
        const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
        const updatedRegistered = registeredUsers.map((u) =>
          u.email.toLowerCase() === user.email.toLowerCase()
            ? { ...u, isManager: true, storeId: newStore.id }
            : u
        );
        localStorage.setItem("registeredUsers", JSON.stringify(updatedRegistered));

        alert(`Đăng ký mở gian hàng "${formData.shopName}" thành công! Đơn của bạn đã được phê duyệt.`);
        navigate("/store-manager/dashboard");
      })();


  };

  const handleCancel = () => {
    if (window.confirm("Bạn có chắc chắn muốn hủy điền đơn đăng ký?")) {
      navigate("/");
    }
  };

  const clearStoreStorage = () => {
    localStorage.removeItem('storeApplication');
    localStorage.removeItem('stores');
    user.isManager = false;
    localStorage.setItem('user', JSON.stringify(user));
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-8 font-sans pb-12">
        {/* Header Info */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Become a Store Manager
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Complete the application below to start selling your premium products on NexCart.
          </p>
        </div>

        {/* 4 Form Sections */}
        <ShopInfoSection formData={formData} handleChange={handleChange} />
        <ContactInfoSection formData={formData} handleChange={handleChange} />
        <IdentityVerificationSection
          formData={formData}
          handleChange={handleChange}
          handleFileChange={handleFileChange}
        />
        <BankDetailsSection formData={formData} handleChange={handleChange} />

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-3 bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-bold rounded-2xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-[#4338ca] hover:bg-[#3730a3] text-white text-xs font-extrabold rounded-2xl shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
          >
            Submit Application
          </button>
        </div>
      </form>
    </div>

  );
};

export default ApplyStoreManager;
