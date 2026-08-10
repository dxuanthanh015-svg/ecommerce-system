import React from "react";
import { useNavigate } from "react-router-dom";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ExistedDeliveryAddress from "./ExistedDeliveryAddress";
import DeliveryAddressForm from "./DeliveryAddressForm";
import OrderSummary from "./OrderSummary";

export default function CheckOut() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#f8f9fc] min-h-screen py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-gray-200/80">
          <span 
            className="text-xl font-extrabold text-gray-900 tracking-tight cursor-pointer" 
            onClick={() => navigate('/')}
          >
            NexCart
          </span>
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <LockOutlinedIcon sx={{ fontSize: 14 }} />
            <span>SECURE CHECKOUT</span>
          </div>
        </div>

        {/* Page Title Subheader */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-1">
            Checkout
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Complete your order safely and securely.
          </p>
        </div>

        {/* Main 2-Column Grid importing ExistedDeliveryAddress, DeliveryAddressForm, and OrderSummary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Left Column: Existed Addresses + Shipping & Payment Forms */}
          <div className="lg:col-span-7">
            <ExistedDeliveryAddress />
            <DeliveryAddressForm />
          </div>

          {/* Right Column: Order Summary Section */}
          <div className="lg:col-span-5">
            <OrderSummary />
          </div>
        </div>

      </div>
    </div>
  );
}
