import React, { useState } from "react";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const DeliveryAddressForm = () => {
  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  const [formData, setFormData] = useState({
  });

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

        <form className="space-y-4">
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
              Safe money transfer using your bank account. We support Mastercard, Visa, Discover and Stripe.
            </p>

            {/* Credit Card Fields */}
            {paymentMethod === "creditCard" && (
              <div className="pl-0 sm:pl-7 space-y-4 pt-2">
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
            onClick={() => setPaymentMethod("paypal")}
            className={`rounded-2xl p-4 sm:p-5 transition-all cursor-pointer flex items-center justify-between ${paymentMethod === "paypal"
              ? "border-2 border-indigo-600 bg-indigo-50/10"
              : "border border-gray-200 hover:border-gray-300 bg-white"
              }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "paypal"}
                onChange={() => setPaymentMethod("paypal")}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <span className="text-sm font-bold text-gray-900">PayPal</span>
            </div>
            <span className="text-xs font-bold text-indigo-600">Pay with PayPal</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryAddressForm;
