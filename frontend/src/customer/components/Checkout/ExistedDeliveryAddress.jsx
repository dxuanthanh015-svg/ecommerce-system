import React, { useState } from "react";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";

const WaveButton = ({ children, className, onClick, waveColor, ...props }) => {
  const [waveKey, setWaveKey] = useState(0);

  const handleClick = (e) => {
    setWaveKey((prev) => prev + 1);
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      {...props}
      onClick={handleClick}
      className={`relative ${className}`}
    >
      {children}
      {waveKey > 0 && (
        <span
          key={waveKey}
          className="absolute inset-0 pointer-events-none animate-wave"
          style={{ borderRadius: "inherit", "--wave-color": waveColor }}
        />
      )}
    </button>
  );
};

const ExistedDeliveryAddress = ({ onSelectAddress, savedAddress, selectedAddress, onRemove, onEdit }) => {
  const handleSelect = (addr) => {
    if (onSelectAddress) {
      onSelectAddress(addr);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-100 shadow-2xs mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <LocationOnOutlinedIcon
            className="text-indigo-600"
            sx={{ fontSize: 22 }}
          />
          <h2 className="text-base sm:text-lg font-bold text-gray-900">
            Saved Delivery Addresses
          </h2>
        </div>
        <span className="text-xs text-gray-500 font-medium">
          {savedAddress.length} saved
        </span>
      </div>

      <div className="space-y-4">
        {savedAddress.map((addr) => {
          const isSelected = selectedAddress?.id === addr.id;
          return (
            <div
              key={addr.id}
              onClick={() => handleSelect(addr)}
              className={`rounded-2xl p-5 border transition-all cursor-pointer relative ${isSelected
                ? "border-2 border-indigo-600 bg-indigo-50/10 shadow-2xs"
                : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {isSelected ? (
                      <CheckCircleIcon
                        className="text-indigo-600"
                        sx={{ fontSize: 20 }}
                      />
                    ) : (
                      <RadioButtonUncheckedIcon
                        className="text-gray-400"
                        sx={{ fontSize: 20 }}
                      />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900">
                        {addr.firstName + " " + addr.lastName}
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

                <div className="flex flex-col space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <WaveButton
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(addr);
                      }}
                      waveColor={isSelected ? "rgba(79, 70, 229, 0.5)" : "rgba(156, 163, 175, 0.5)"}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${isSelected
                        ? "bg-indigo-600 text-white shadow-xs active:ring-4 active:ring-indigo-300 transition-all duration-500"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }`}
                    >
                      {isSelected ? "Delivering Here" : "Deliver Here"}
                    </WaveButton>
                    <WaveButton
                      type="button"
                      waveColor="rgba(239, 68, 68, 0.5)"
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${isSelected
                        ? "bg-red-500 text-amber-50 active:ring-red-300 transition-all duration-150"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(addr.id);
                      }}
                    >
                      Remove
                    </WaveButton>
                  </div>

                  <div className="w-fit m-auto">
                    <WaveButton
                      type="button"
                      waveColor="rgba(156, 163, 175, 0.5)"
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer hover:bg-gray-400 ${"bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(addr);
                      }}
                    >
                      Edit
                    </WaveButton>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExistedDeliveryAddress;
