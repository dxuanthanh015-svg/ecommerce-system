import React, { useState, useEffect } from "react";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import toast from "react-hot-toast";

const DeliveryAddressForm = ({ savedAddress, selectedAddress, editingAddress, onCancelEdit, paymentMethod, setPaymentMethod, onAddressSaved }) => {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  useEffect(() => {
    const addressToPopulate = editingAddress || selectedAddress;
    if (addressToPopulate) {
      setFormData({
        ...formData,
        email: addressToPopulate.email || "",
        firstName: addressToPopulate.firstName || "",
        lastName: addressToPopulate.lastName || "",
        phone: addressToPopulate.phone || "",
        address: addressToPopulate.address || addressToPopulate.streetAddress || "",
        city: addressToPopulate.city || "",
        district: addressToPopulate.district || "",
      });
    }
  }, [editingAddress, selectedAddress]);

  const handleShippingSave = async (e) => {
    e.preventDefault();
    const { firstName, lastName, phone, address, city, district } = formData;
    if (![firstName, lastName, phone, address, city, district].every((value) => value.trim())) {
      toast.error("Vui lòng nhập họ tên, số điện thoại và đầy đủ địa chỉ!");
      return;
    }

    let updatedList;
    if (editingAddress) {
      // Update existing address by id
      updatedList = savedAddress.map((addr) =>
        addr.id === editingAddress.id
          ? {
            ...addr,
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            district: formData.district,
          }
          : addr
      );
    } else {
      // Add new address
      const shippingData = {
        id: Date.now(),
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        district: formData.district,
      };
      updatedList = [...savedAddress, shippingData];
    }

    // Persist lên server → React Query tự recompute savedAddress
    if (onAddressSaved) {
      try {
        await onAddressSaved(updatedList);
      } catch {
        toast.error("Không thể lưu địa chỉ. Vui lòng thử lại!");
        return;
      }
    }

    if (editingAddress) {
      onCancelEdit();
      toast.success("Đã cập nhật địa chỉ giao hàng!");
    } else {
      toast.success("Đã lưu địa chỉ giao hàng mới!");
    }

    setFormData({
      ...formData,
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      city: "",
      district: "",
    });
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6">
      {/* Card 1: Shipping Details */}
      <div className="bg-white rounded-2xl p-4 sm:p-7 border border-gray-100 shadow-2xs">
        <div className="flex items-center gap-2 mb-6">
          <LocalShippingOutlinedIcon className="text-indigo-600" sx={{ fontSize: 22 }} />
          <h2 className="text-base sm:text-lg font-bold text-gray-900">
            Shipping Details
          </h2>
        </div>

        <form className="space-y-4" onSubmit={handleShippingSave}>
          {/* Email */}
          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              className="w-full bg-[#f8f9fc] border border-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-900 transition-all"
            />
          </div>

          {/* Name Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                FIRST NAME
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="w-full bg-[#f8f9fc] border border-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-900 transition-all"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                LAST NAME
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="w-full bg-[#f8f9fc] border border-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-900 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
              PHONE NUMBER
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="0123456789"
              className="w-full bg-[#f8f9fc] border border-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-900 transition-all"
            />
          </div>
          {/* Street Address */}
          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
              STREET ADDRESS
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Luxury Ave, Suite 400"
              className="w-full bg-[#f8f9fc] border border-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-900 transition-all"
            />
          </div>

          {/* City, District */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                CITY
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                className="w-full bg-[#f8f9fc] border border-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-900 transition-all"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                DISTRICT
              </label>
              <input type="text" name="district" value={formData.district} onChange={handleChange} placeholder="District"
                className="w-full bg-[#f8f9fc] border border-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-900 transition-all"
              />
            </div>

          </div>
          <div className="flex items-center justify-center gap-3">
            <button type="submit" className="w-min bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-all text-sm sm:text-base" >
              {editingAddress ? "Update" : "Save"}
            </button>
            {editingAddress && (
              <button
                type="button"
                onClick={() => {
                  onCancelEdit();
                  setFormData({
                    ...formData,
                    email: "",
                    firstName: "",
                    lastName: "",
                    phone: "",
                    address: "",
                    city: "",
                    district: "",
                  });
                }}
                className="w-min bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-4 rounded-xl transition-all text-sm sm:text-base"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Card 2: Payment Method */}
      <div className="bg-white rounded-2xl p-4 sm:p-7 border border-gray-100 shadow-2xs">
        <div className="flex items-center gap-2 mb-6">
          <CreditCardOutlinedIcon className="text-indigo-600" sx={{ fontSize: 22 }} />
          <h2 className="text-base sm:text-lg font-bold text-gray-900">
            Payment Method
          </h2>
        </div>

        <div className="space-y-4">
          {/* VNPAY sandbox payment */}
          <div
            onClick={() => setPaymentMethod("ONLINE")}
            className={`rounded-2xl p-4 sm:p-5 transition-all cursor-pointer ${paymentMethod === "ONLINE"
              ? "border-2 border-indigo-600 bg-indigo-50/10"
              : "border border-gray-200 hover:border-gray-300"
              }`}
          >
            <div className="flex items-center gap-3">
              <input type="radio" name="payment" checked={paymentMethod === "ONLINE"}
                onChange={() => setPaymentMethod("ONLINE")} className="h-4 w-4 text-indigo-600" />
              <div>
                <span className="text-sm font-bold text-gray-900">Thanh toán online</span>
                <p className="mt-1 text-xs text-gray-500">Thanh toán qua cổng VNPAY.</p>
              </div>
            </div>
          </div>

          {/* Cash on delivery */}
          <div
            onClick={() => setPaymentMethod("COD")}
            className={`rounded-2xl p-4 sm:p-5 transition-all cursor-pointer ${paymentMethod === "COD"
              ? "border-2 border-indigo-600 bg-indigo-50/10"
              : "border border-gray-200 hover:border-gray-300 bg-white"
              }`}
          >
            <div className="flex items-center gap-3">
              <input type="radio" name="payment" checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")} className="h-4 w-4 text-indigo-600" />
              <span className="text-sm font-bold text-gray-900">Thanh toán khi nhận hàng (COD)</span>
            </div>
            <p className="mt-2 pl-7 text-xs text-gray-500">Đơn hàng được tạo ở trạng thái chờ xác nhận; thanh toán được ghi nhận khi bạn xác nhận đã nhận hàng.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryAddressForm;
