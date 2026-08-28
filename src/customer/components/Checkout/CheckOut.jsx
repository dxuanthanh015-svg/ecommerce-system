import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ExistedDeliveryAddress from "./ExistedDeliveryAddress";
import DeliveryAddressForm from "./DeliveryAddressForm";
import OrderSummary from "./OrderSummary";
import { authService } from "../../../services";

export default function CheckOut() {
  const navigate = useNavigate();
  const [savedAddress, setSavedAddress] = useState([]);
  const [editingAddress, setEditingAddress] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("creditCard");

  useEffect(() => {
    const loadUserAddresses = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user?.savedAddresses && Array.isArray(user.savedAddresses)) {
          setSavedAddress(user.savedAddresses);
          setSelectedAddress(user.savedAddresses[0] || null);
        } else if (user?.address || user?.specificAddress) {
          const defaultAddr = {
            id: `addr-${Date.now()}`,
            fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Customer",
            phone: user.phone || "",
            streetAddress: user.specificAddress || user.address || "",
            city: user.city || "New York",
            district: user.district || "",
            state: "NY",
            zipCode: "10001",
          };
          setSavedAddress([defaultAddr]);
          setSelectedAddress(defaultAddr);
        }
      } catch (err) {
        console.error("Error loading user addresses:", err);
      }
    };
    loadUserAddresses();
  }, []);

  const handleRemove = async (id) => {
    const updated = savedAddress.filter((addr) => addr.id !== id);
    setSavedAddress(updated);
    if (selectedAddress?.id === id) {
      setSelectedAddress(updated[0] || null);
    }
    try {
      await authService.updateProfile({ savedAddresses: updated });
    } catch (e) {
      console.warn("Error updating user addresses:", e.message);
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
