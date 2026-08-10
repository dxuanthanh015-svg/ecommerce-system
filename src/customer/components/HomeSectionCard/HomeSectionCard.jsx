import React from "react";

const HomeSectionCard = ({ product }) => {
  const displayPrice = product?.discountedPrice ?? product?.price;
  const originalPrice = product?.discountedPrice ? product?.price : null;

  return (
    <div className="cursor-pointer flex flex-col bg-white rounded-md overflow-hidden border border-gray-100/80 hover:shadow-lg transition-all duration-300 mx-2 my-2 group">
      {/* Image Container */}
      <div className="relative aspect-[3/4] sm:h-[340px] w-full bg-[#f4f4f6] overflow-hidden">
        {/* Badge */}
        {product?.badge && (
          <span className="absolute top-3 left-3 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md z-10">
            {product.badge}
          </span>
        )}

        <img
          className="object-cover object-top h-full w-full group-hover:scale-105 transition-transform duration-500 ease-out"
          src={product?.imageUrl || product?.image}
          alt={product?.title || "Product image"}
          role="presentation"
        />
      </div>

      {/* Info Container */}
      <div className="p-4 flex flex-col justify-between flex-grow bg-white">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {product?.title}
          </h3>
        </div>

        <div className="mt-2 flex items-center gap-2">
          {displayPrice !== undefined && (
            <span className={`text-sm font-bold ${originalPrice ? 'text-indigo-600' : 'text-gray-900'}`}>
              ${typeof displayPrice === 'number' ? displayPrice.toFixed(2) : displayPrice}
            </span>
          )}
          {originalPrice && (
            <span className="text-xs text-gray-400 line-through">
              ${typeof originalPrice === 'number' ? originalPrice.toFixed(2) : originalPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeSectionCard;

