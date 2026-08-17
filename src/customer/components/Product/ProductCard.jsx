import React from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const handleClickCard = () => navigate(`/product/${product?.id}`);

  const hasDiscount = product?.discountedPrice && product?.discountedPrice < product?.price;
  const badgeText = product?.badge || (hasDiscount ? `${product.discountPersent}% OFF` : null);

  return (
    <div
      onClick={handleClickCard}
      className="group cursor-pointer flex flex-col bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 w-full"
    >
      {/* Image Box */}
      <div className="relative aspect-[3/4] sm:h-[340px] w-full bg-[#f4f4f6] overflow-hidden">
        {badgeText && (
          <span className="absolute top-3 left-3 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md z-10 shadow-sm">
            {badgeText}
          </span>
        )}
        <img
          className="object-cover object-top h-full w-full group-hover:scale-105 transition-transform duration-500 ease-out"
          src={product.imageUrl || product.image}
          alt={product.title || "Product image"}
          role="presentation"
        />
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col justify-between flex-grow bg-white">
        <div>
          {product.brand && (
            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">
              {product.brand}
            </p>
          )}
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {product.title}
          </h3>
        </div>

        {/* Price Row */}
        <div className="mt-3 flex items-center flex-wrap gap-1.5">
          <span className={`text-xs sm:text-sm font-bold ${hasDiscount ? 'text-indigo-600' : 'text-gray-900'}`}>
            ${product.discountedPrice || product.price}
          </span>
          {hasDiscount && (
            <>
              <span className="text-[11px] text-gray-400 line-through">
                ${product.price}
              </span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                Save {product.discountPersent}%
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

