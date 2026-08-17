import React, { useState, useEffect } from "react";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const DeliveryAddressForm = ({ savedAddress, setSavedAddress, editingAddress, onCancelEdit, paymentMethod, setPaymentMethod }) => {
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
    if (editingAddress) {
      setFormData({
        ...formData,
        email: editingAddress.email || "",
        firstName: editingAddress.firstName || "",
        lastName: editingAddress.lastName || "",
        phone: editingAddress.phone || "",
        address: editingAddress.address || "",
        city: editingAddress.city || "",
        district: editingAddress.district || "",
      });
    }
  }, [editingAddress]);

  const handleShippingSave = (e) => {
    e.preventDefault();
    const { firstName, lastName, phone, address, city, district } = formData;
    if (!firstName.trim() && !lastName.trim() && !phone.trim() && !address.trim() && !city.trim() && !district.trim()) return;
    if (editingAddress) {
      // Update existing address by id
      setSavedAddress(
        savedAddress.map((addr) =>
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
        )
      );
      onCancelEdit();
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
      setSavedAddress([...savedAddress, shippingData]);
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
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-100 shadow-2xs">
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
            <button className="w-min bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-all text-sm sm:text-base" >
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
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-100 shadow-2xs">
        <div className="flex items-center gap-2 mb-6">
          <CreditCardOutlinedIcon className="text-indigo-600" sx={{ fontSize: 22 }} />
          <h2 className="text-base sm:text-lg font-bold text-gray-900">
            Payment Method
          </h2>
        </div>

        <div className="space-y-4">
          {/* Option 1: Credit Card */}
          <div
            onClick={() => setPaymentMethod("creditCard")}
            className={`rounded-2xl p-5 transition-all cursor-pointer ${paymentMethod === "creditCard"
              ? "border-2 border-indigo-600 bg-indigo-50/10"
              : "border border-gray-200 hover:border-gray-300"
              }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "creditCard"}
                  onChange={() => setPaymentMethod("creditCard")}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <span className="text-sm font-bold text-gray-900">Credit Card</span>
              </div>
              {/* Card Logos */}
              <div className="flex items-center gap-1.5 text-gray-400">
                <span className="text-[10px] font-bold border border-gray-300 px-1.5 py-0.5 rounded">VISA</span>
                <span className="text-[10px] font-bold border border-gray-300 px-1.5 py-0.5 rounded">MC</span>
              </div>
            </div>

            <p className="text-xs text-gray-500 mb-4 pl-7 leading-relaxed">
              Safe & encrypted credit card payment. We support Visa, Mastercard, Discover, and American Express.
            </p>

            {/* Credit Card Fields */}
            {paymentMethod === "creditCard" && (
              <div className="pl-0 sm:pl-7 space-y-4 pt-2">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                    CARDHOLDER NAME
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="cardholderName"
                      value={formData.cardholderName}
                      onChange={handleChange}
                      placeholder="Đặng Xuân Thành"
                      className="w-full bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl pl-4 pr-10 py-2.5 text-xs sm:text-sm text-gray-900 w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                    CARD NUMBER
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="0000 0000 0000 0000"
                      className="w-full bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl pl-4 pr-10 py-2.5 text-xs sm:text-sm text-gray-900"
                    />
                    <CreditCardOutlinedIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" sx={{ fontSize: 18 }} />
                  </div>
                </div>


                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                      EXPIRY DATE
                    </label>
                    <input
                      type="text"
                      name="expiry"
                      value={formData.expiry}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      className="w-full bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                      CVC
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="cvc"
                        value={formData.cvc}
                        onChange={handleChange}
                        placeholder="123"
                        className="w-full bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl pl-4 pr-9 py-2.5 text-xs sm:text-sm text-gray-900"
                      />
                      <InfoOutlinedIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" sx={{ fontSize: 16 }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Option 2: PayPal */}
          <div
            onClick={() => setPaymentMethod("VN-PAY")}
            className={`rounded-2xl p-4 sm:p-5 transition-all cursor-pointer flex items-center justify-between ${paymentMethod === "VN-PAY"
              ? "border-2 border-indigo-600 bg-indigo-50/10"
              : "border border-gray-200 hover:border-gray-300 bg-white"
              }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "VN-PAY"}
                onChange={() => setPaymentMethod("VN-PAY")}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <span className="text-sm font-bold text-gray-900">VN-PAY</span>
            </div>
            <span className="text-xs font-bold text-indigo-600">Pay with VN-PAY</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryAddressForm;
