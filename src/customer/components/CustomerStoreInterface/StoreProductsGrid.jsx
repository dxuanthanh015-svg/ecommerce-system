import React from "react";
import { useNavigate } from "react-router-dom";
import { Rating } from "@mui/material";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

import { getUserCart, saveUserCart } from "../../utils/cartUtils";

const StoreProductsGrid = ({ products }) => {
  const navigate = useNavigate();

  const handleProductClick = (productId) => {
    navigate(`/productdetails/${productId}`);
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    const currentCart = getUserCart();
    const existingIndex = currentCart.findIndex((c) => String(c.id) === String(product.id));

    if (existingIndex > -1) {
      const updatedItem = {
        ...currentCart[existingIndex],
        quantity: (currentCart[existingIndex].quantity || 1) + 1,
      };
      currentCart.splice(existingIndex, 1);
      currentCart.unshift(updatedItem);
    } else {
      currentCart.unshift({
        id: product.id,
        id_store: product.id_store || product.storeId || "store-001",
        title: product.title,
        price: product.discountedPrice || product.price,
        quantity: 1,
        imageUrl: product.imageUrl,
        color: "Default",
        size: "M",
      });
    }

    saveUserCart(currentCart);
    alert(`Đã thêm "${product.title}" vào giỏ hàng!`);
  };

  const handleSaveToWishlist = (e, product) => {
    e.stopPropagation();
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const isAlreadySaved = wishlist.some((item) => String(item.id) === String(product.id));

    if (!isAlreadySaved) {
      const wishlistItem = {
        id: product.id,
        id_store: product.id_store || product.storeId || "store-001",
        title: product.title,
        brand: product.brand || "NexCart Store",
        price: product.price,
        discountedPrice: product.discountedPrice || product.price,
        imageUrl: product.imageUrl,
        inStock: true,
      };
      localStorage.setItem("wishlist", JSON.stringify([wishlistItem, ...wishlist]));
      alert(`Đã thêm "${product.title}" vào danh sách yêu thích!`);
    } else {
      alert(`Sản phẩm "${product.title}" đã có trong danh sách yêu thích.`);
    }
  };

  if (!products || products.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-2xs max-w-md mx-auto my-12">
        <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
          <Inventory2OutlinedIcon sx={{ fontSize: 32 }} />
        </div>
        <h3 className="text-lg font-extrabold text-gray-900 mb-2">Không tìm thấy sản phẩm nào</h3>
        <p className="text-xs text-gray-500 mb-6 leading-relaxed">
          Gian hàng chưa có sản phẩm nào phù hợp với bộ lọc hoặc từ khóa tìm kiếm của bạn.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => {
        const discountPercent =
          product.price && product.discountedPrice && product.price > product.discountedPrice
            ? Math.round(((product.price - product.discountedPrice) / product.price) * 100)
            : null;

        return (
          <div
            key={product.id}
            onClick={() => handleProductClick(product.id)}
            className="bg-white rounded-3xl p-4 border border-gray-100 shadow-2xs hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Product Image & Badges */}
              <div className="relative aspect-4/5 w-full rounded-2xl overflow-hidden bg-gray-50 mb-3.5 border border-gray-100">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  {discountPercent && (
                    <span className="bg-rose-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-2xs">
                      -{discountPercent}%
                    </span>
                  )}
                  {product.badge && (
                    <span className="bg-indigo-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Wishlist Icon Button */}
                <button
                  type="button"
                  onClick={(e) => handleSaveToWishlist(e, product)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-400 hover:text-rose-500 shadow-sm flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
                  title="Thêm vào yêu thích"
                >
                  <FavoriteBorderOutlinedIcon sx={{ fontSize: 16 }} />
                </button>
              </div>

              {/* Title & Price */}
              <div className="space-y-1 px-1 mb-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  {product.brand || "OFFICIAL STORE"}
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
                  {product.title}
                </h3>

                <div className="flex items-center gap-1.5 pt-1">
                  <Rating value={4.8} precision={0.5} readOnly size="small" sx={{ color: "#6366f1" }} />
                  <span className="text-[11px] font-semibold text-gray-400">(4.8)</span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <span className="text-sm font-black text-gray-900">
                    ${(product.discountedPrice || product.price || 0).toFixed(2)}
                  </span>
                  {product.price && product.discountedPrice && product.price > product.discountedPrice && (
                    <span className="text-xs text-gray-400 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Add to Cart Action */}
            <div className="pt-2">
              <button
                type="button"
                onClick={(e) => handleAddToCart(e, product)}
                className="w-full bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <ShoppingBagOutlinedIcon sx={{ fontSize: 16 }} />
                <span>Thêm vào giỏ</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StoreProductsGrid;
