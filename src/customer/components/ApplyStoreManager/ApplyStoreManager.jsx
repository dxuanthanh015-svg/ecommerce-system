import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ShopInfoSection from "./ShopInfoSection";
import ContactInfoSection from "./ContactInfoSection";
import IdentityVerificationSection from "./IdentityVerificationSection";
import BankDetailsSection from "./BankDetailsSection";
import { authService, storeService } from "../../../services";
import { useCurrentUser } from "../../../hooks/useAuthQuery";
import toast from "react-hot-toast";

const ApplyStoreManager = () => {
  const navigate = useNavigate();
  const { data: user, isLoading } = useCurrentUser();
  const [currentUser, setCurrentUser] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    storeName: "",
    businessEmail: "",
    phone: "",
    pickupAddress: "",
    businessType: "individual",
    taxCode: "",
    idCardNumber: "",
    documentFileName: "",
    bankName: "",
    accountHolder: "",
    accountNumber: "",
  });

  useEffect(() => {
    if (isLoading) return;
    if (user) {
      if (user.isManager) {
        toast(`Bạn đã là Store Manager! Đang chuyển đến trang quản trị...`, { icon: 'ℹ️' });
        navigate("/store-manager/dashboard", { replace: true });
        return;
      }

      setCurrentUser(user);
      setFormData((prev) => ({
        ...prev,
        businessEmail: user.email || "",
        phone: user.phone || "",
        pickupAddress: user.specificAddress || "",
        accountHolder: user.firstName ? `${user.firstName} ${user.lastName}` : "",
      }));
    } else {
      toast.error("Vui lòng đăng nhập tài khoản trước khi đăng ký mở gian hàng!");
      navigate("/login", { replace: true });
    }
  }, [user, isLoading, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, documentFileName: file.name });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.shopName || !formData.businessEmail || !formData.phone || !formData.bankName) {
      toast.error("Vui lòng điền đầy đủ các thông tin bắt buộc!");
      return;
    }

    if (currentUser?.isManager) {
      toast(`Bạn đã là Store Manager rồi!`, { icon: 'ℹ️' });
      navigate("/store-manager/dashboard");
      return;
    }

    const storeId = `store-${Date.now()}`;
    const newStore = {
      id: storeId,
      name: formData.shopName,
      owner: `${currentUser?.firstName || "NexCart"} ${currentUser?.lastName || "Partner"}`,
      ownerEmail: currentUser?.email,
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
      createdAt: new Date().toISOString(),
    };

    try {
      await storeService.saveStoreApplication({ ...formData, storeId, submittedAt: new Date().toISOString() });
      await storeService.createInAllStores(newStore);
      await storeService.createStore(newStore);
      await storeService.setCurrentStore(newStore);

      await authService.updateProfile({
        isManager: true,
        storeId: storeId,
      });

      window.dispatchEvent(new Event("userSessionUpdated"));
      toast.success(`Đăng ký gian hàng "${formData.shopName}" thành công!`);
      navigate("/store-manager/dashboard");
    } catch (err) {
      console.error("Error creating store:", err);
      toast.error("Có lỗi xảy ra khi tạo gian hàng trên server!");
    }
  };

  const handleCancel = () => {
    toast((t) => (
      <span>
        Hủy đăng ký?
        <button onClick={() => { navigate("/"); toast.dismiss(t.id); }} style={{marginLeft:8,background:'#ef4444',color:'#fff',border:'none',borderRadius:6,padding:'2px 10px',cursor:'pointer',fontWeight:600}}>Hủy đăng ký</button>
        <button onClick={() => toast.dismiss(t.id)} style={{marginLeft:6,background:'#e5e7eb',color:'#374151',border:'none',borderRadius:6,padding:'2px 10px',cursor:'pointer',fontWeight:600}}>Tiếp tục</button>
      </span>
    ), { duration: 6000 });
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
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
          >
            Submit Application
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplyStoreManager;
