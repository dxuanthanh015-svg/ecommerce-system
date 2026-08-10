import React, { useState } from "react";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";

const savedAddresses = [
  {
    id: 1,
    name: "Jane Doe",
    isDefault: true,
    address: "123 Luxury Ave, Suite 400",
    city: "New York",
    district: "Manhattan",
    phone: "0987 276 292"
  },
  {
    id: 2,
    name: "Jane Doe (Office)",
    isDefault: false,
    address: "456 Park Avenue, Floor 12",
    city: "New York",
    district: "Midtown",
    phone: "0912 345 678"
  }
];

const ExistedDeliveryAddress = ({ onSelectAddress }) => {
  const [selectedId, setSelectedId] = useState(1);

  const handleSelect = (addr) => {
    setSelectedId(addr.id);
    if (onSelectAddress) {
      onSelectAddress(addr);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-100 shadow-2xs mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <LocationOnOutlinedIcon className="text-indigo-600" sx={{ fontSize: 22 }} />
          <h2 className="text-base sm:text-lg font-bold text-gray-900">
            Saved Delivery Addresses
          </h2>
        </div>
        <span className="text-xs text-gray-500 font-medium">
          {savedAddresses.length} saved
        </span>
      </div>

      <div className="space-y-4">
        {savedAddresses.map((addr) => {
          const isSelected = selectedId === addr.id;
          return (
            <div
              key={addr.id}
              onClick={() => handleSelect(addr)}
              className={`rounded-2xl p-5 border transition-all cursor-pointer relative ${
                isSelected
                  ? "border-2 border-indigo-600 bg-indigo-50/10 shadow-2xs"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {isSelected ? (
                      <CheckCircleIcon className="text-indigo-600" sx={{ fontSize: 20 }} />
                    ) : (
                      <RadioButtonUncheckedIcon className="text-gray-400" sx={{ fontSize: 20 }} />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900">
                        {addr.name}
                      </span>
                      {addr.isDefault && (
                        <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          DEFAULT
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {addr.address}, {addr.district}, {addr.city}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-500 pt-1">
                      <LocalPhoneOutlinedIcon sx={{ fontSize: 14 }} />
                      <span>{addr.phone}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(addr);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  {isSelected ? "Delivering Here" : "Deliver Here"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExistedDeliveryAddress;
