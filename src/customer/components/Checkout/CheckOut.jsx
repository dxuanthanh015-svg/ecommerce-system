import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ExistedDeliveryAddress from "./ExistedDeliveryAddress";
import DeliveryAddressForm from "./DeliveryAddressForm";
import OrderSummary from "./OrderSummary";
import { useEffect } from "react";

export default function CheckOut() {
  const navigate = useNavigate();
  const [savedAddress, setSavedAddress] = useState(() => {
    const localData = localStorage.getItem("savedAddresses");
    return localData ? JSON.parse(localData) : [];
  });
  const [editingAddress, setEditingAddress] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(savedAddress ? savedAddress[0] : null);
  const [paymentMethod, setPaymentMethod] = useState("creditCard");

  useEffect(() => {
    localStorage.setItem("savedAddresses", JSON.stringify(savedAddress));
  }, [savedAddress]);

  const handleRemove = (id) => {
    setSavedAddress(savedAddress.filter((addr) => addr.id !== id));
    if (selectedAddress?.id === id) {
      setSelectedAddress(null);
    }
  };

  const handleEdit = (addr) => {
    setEditingAddress(addr);
  };

  const handleCancelEdit = () => {
    setEditingAddress(null);
  };

  return (
    <div className="bg-[#f8f9fc] min-h-screen py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-1 text-center">
            Checkout
          </h1>
          <p className=" text-xs sm:text-sm text-gray-500 text-center">
            Complete your order safely and securely.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Left Column: Existed Addresses + Shipping & Payment Forms */}
          <div className="lg:col-span-7">
            <ExistedDeliveryAddress
              savedAddress={savedAddress}
              selectedAddress={selectedAddress}
              onSelectAddress={setSelectedAddress}
              onRemove={handleRemove}
              onEdit={handleEdit}
            />
            <DeliveryAddressForm
              savedAddress={savedAddress}
              setSavedAddress={setSavedAddress}
              editingAddress={editingAddress}
              onCancelEdit={handleCancelEdit}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />
          </div>

          <div className="lg:col-span-5">
            <OrderSummary
              savedAddress={savedAddress}
              selectedAddress={selectedAddress}
              paymentMethod={paymentMethod}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
