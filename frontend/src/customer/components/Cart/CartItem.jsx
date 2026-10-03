import React, { useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const CartItem = ({ item, onRemove, onUpdateQuantity }) => {
  const [quantity, setQuantity] = useState(item?.quantity || 1);

  const handleDecrease = () => {
    if (quantity > 1) {
      const nextQty = quantity - 1;
      setQuantity(nextQty);
      if (onUpdateQuantity) {
        onUpdateQuantity(item.id, nextQty);
      }
    }
  };

  const handleIncrease = () => {
    const nextQty = quantity + 1;
    setQuantity(nextQty);
    if (onUpdateQuantity) {
      onUpdateQuantity(item.id, nextQty);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xs mb-4 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
      {/* Left: Image + Meta */}
      <div className="flex items-center gap-4 sm:gap-6 flex-1">
        {/* Product Image */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
          <img
            className="w-full h-full object-cover object-center"
            src={item?.imageUrl || item?.image}
            alt={item?.title || "Cart item"}
          />
        </div>

        {/* Info */}
        <div className="space-y-1.5">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900">
            {item?.title}
          </h3>
          <p className="text-xs text-gray-500 font-medium">
            Color: {item?.color || "Beige"} &nbsp;|&nbsp; Size: {item?.size || "M"}
          </p>

          {/* Quantity Controls (Mobile view inline) */}
          <div className="pt-2 flex items-center gap-3">
            <div className="inline-flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white shadow-2xs">
              <button
                onClick={handleDecrease}
                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
                aria-label="Decrease quantity"
              >
                <RemoveIcon sx={{ fontSize: 14 }} />
              </button>
              <span className="w-9 text-center text-xs font-bold text-gray-900 select-none">
                {quantity}
              </span>
              <button
                onClick={handleIncrease}
                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
                aria-label="Increase quantity"
              >
                <AddIcon sx={{ fontSize: 14 }} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Price & Remove Action */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 h-full">
        <span className="text-base sm:text-lg font-bold text-gray-900">
          ${((item?.price || 0) * quantity).toFixed(2)}
        </span>

        <button
          onClick={() => onRemove && onRemove(item?.id)}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors cursor-pointer flex items-center gap-1 mt-0 sm:mt-6"
        >
          <DeleteOutlineIcon sx={{ fontSize: 16 }} />
          <span>Remove</span>
        </button>
      </div>
    </div>
  );
};

export default CartItem;

