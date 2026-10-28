import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import ExistedDeliveryAddress from "./ExistedDeliveryAddress";
import DeliveryAddressForm from "./DeliveryAddressForm";
import OrderSummary from "./OrderSummary";
import { useCurrentUser, useUpdateProfileMutation } from "../../../hooks/useAuthQuery";
import { QUERY_KEYS } from "../../../constants/queryKeys";
import toast from "react-hot-toast";

export default function CheckOut() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();
  const { mutateAsync: updateProfile } = useUpdateProfileMutation();
  const [editingAddress, setEditingAddress] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("creditCard");

  // Tính trực tiếp từ React Query cache — không cần useState + useEffect
  const savedAddress = useMemo(() => {
    if (Array.isArray(user?.addresses)) {
      return user.addresses;
    } else if (Array.isArray(user?.savedAddresses)) {
      return user.savedAddresses;
    } else if (user?.address || user?.specificAddress) {
      return [{
        id: `addr-default`,
        fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Customer",
        phone: user.phone || "",
        streetAddress: user.specificAddress || user.address || "",
        city: user.city || "New York",
        district: user.district || "",
        state: "NY",
        zipCode: "10001",
      }];
    }
    return [];
  }, [user]);

  // Chọn địa chỉ mặc định (hoặc địa chỉ đầu tiên) sau khi profile tải xong.
  // Nếu danh sách được tải/cập nhật lại, thay lựa chọn cũ bằng object mới từ API.
  useEffect(() => {
    if (savedAddress.length === 0) {
      setSelectedAddress(null);
      return;
    }

    const currentAddress = savedAddress.find((address) => address.id === selectedAddress?.id);
    if (currentAddress) {
      if (currentAddress !== selectedAddress) setSelectedAddress(currentAddress);
      return;
    }

    setSelectedAddress(savedAddress.find((address) => address.isDefault) || savedAddress[0]);
  }, [savedAddress, selectedAddress]);

  const handleRemove = async (id) => {
    const updated = savedAddress.filter((addr) => addr.id !== id);
    if (selectedAddress?.id === id) {
      setSelectedAddress(updated[0] || null);
    }
    try {
      // updateProfile invalida cache → savedAddress recompute tự động
      await updateProfile({ 
        id: user?.id || user?._id, 
        data: { addresses: updated }
      });
      // Manually invalidate the query to trigger refetch
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CURRENT_USER });
      toast.success("Đã xóa địa chỉ giao hàng!");
    } catch (e) {
      console.warn("Error updating user addresses:", e.message);
      toast.error("Có lỗi xảy ra khi xóa địa chỉ!");
    }
  };

  const handleEdit = (addr) => {
    setEditingAddress(addr);
  };

  const handleCancelEdit = () => {
    setEditingAddress(null);
  };

  // Persist danh sách địa chỉ lên server sau khi thêm/sửa
  const handleAddressSaved = async (updatedList) => {
    try {
      const updatedUser = await updateProfile({
        id: user?.id || user?._id,
        data: { addresses: updatedList }
      });
      // Manually invalidate the query to trigger refetch
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CURRENT_USER });
      // Auto-select địa chỉ mới thêm nếu là địa chỉ đầu tiên
      if (updatedList.length > 0 && !selectedAddress) {
        const persistedAddresses = updatedUser?.addresses || updatedList;
        setSelectedAddress(persistedAddresses[persistedAddresses.length - 1]);
      }
    } catch (e) {
      console.warn("Error persisting addresses:", e.message);
      throw e;
    }
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
              selectedAddress={selectedAddress}
              editingAddress={editingAddress}
              onCancelEdit={handleCancelEdit}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              onAddressSaved={handleAddressSaved}
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
