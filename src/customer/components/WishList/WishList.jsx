import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";


const WishList = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("wishlist");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0) return parsed;
    }
    return defaultWishlistMock;
  });

  const handleRemoveFromWishlist = (id) => {
    const updated = wishlist.filter((item) => String(item.id) !== String(id));
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  const handleClearAll = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ danh sách yêu thích?")) {
      setWishlist([]);
      localStorage.setItem("wishlist", JSON.stringify([]));
    }
  };

  const handleAddToCart = (item) => {
    const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingIndex = currentCart.findIndex((c) => String(c.id) === String(item.id));

    if (existingIndex > -1) {
      currentCart[existingIndex].quantity = (currentCart[existingIndex].quantity || 1) + 1;
    } else {
      currentCart.push({
        id: item.id,
        id_store: item.id_store || "store-001",
        title: item.title,
        price: item.discountedPrice || item.price,
        quantity: 1,
        imageUrl: item.imageUrl,
        color: "Default",
        size: "M",
      });
    }

    localStorage.setItem("cart", JSON.stringify(currentCart));
    alert(`Đã thêm "${item.title}" vào giỏ hàng!`);
    navigate("/cart");
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    alert("Đã sao chép liên kết danh sách yêu thích vào bộ nhớ tạm!");
  };

  return (
    <div className="bg-[#f8f9fc]/60 min-h-screen py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              My Wishlist
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {wishlist.length} item{wishlist.length !== 1 ? "s" : ""} saved for later
            </p>
          </div>

          {wishlist.length > 0 && (
            <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
              <button
                type="button"
                onClick={handleShare}
                className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors cursor-pointer"
              >
                <ShareOutlinedIcon sx={{ fontSize: 16 }} />
                <span>Share</span>
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="hover:text-red-600 transition-colors cursor-pointer text-gray-400"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Wishlist Items Grid */}
        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((item) => {
              const discountPercent = item.price && item.discountedPrice && item.price > item.discountedPrice
                ? Math.round(((item.price - item.discountedPrice) / item.price) * 100)
                : null;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl p-4 border border-gray-100 shadow-2xs hover:shadow-lg transition-all group flex flex-col justify-between"
                >
                  {/* Image Container */}
                  <div>
                    <div className="relative aspect-4/5 w-full rounded-2xl overflow-hidden bg-gray-50 mb-4 border border-gray-100">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        {item.inStock !== false ? (
                          <span className="bg-white/90 backdrop-blur-xs text-[10px] font-bold text-gray-700 px-2 py-0.5 rounded-md uppercase tracking-wider shadow-2xs">
                            IN STOCK
                          </span>
                        ) : (
                          <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                            OUT OF STOCK
                          </span>
                        )}

                        {discountPercent && (
                          <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md self-start">
                            -{discountPercent}%
                          </span>
                        )}
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveFromWishlist(item.id)}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-rose-500 shadow-sm flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
                        title="Remove from Wishlist"
                      >
                        <FavoriteIcon sx={{ fontSize: 16 }} />
                      </button>
                    </div>

                    {/* Meta & Title */}
                    <div className="space-y-1 mb-3 px-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        {item.brand || "NEXCART"}
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-2 leading-snug">
                        {item.title}
                      </h3>

                      {/* Price */}
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-sm font-black text-gray-900">
                          ${(item.discountedPrice || item.price || 0).toFixed(2)}
                        </span>
                        {item.price && item.discountedPrice && item.price > item.discountedPrice && (
                          <span className="text-xs text-gray-400 line-through">
                            ${item.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Add to Cart CTA */}
                  <div className="pt-2">
                    {item.inStock !== false ? (
                      <button
                        type="button"
                        onClick={() => handleAddToCart(item)}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm hover:shadow-indigo-500/25 transition-all cursor-pointer"
                      >
                        <ShoppingBagOutlinedIcon sx={{ fontSize: 16 }} />
                        <span>Add to Cart</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="w-full bg-gray-100 text-gray-400 font-bold py-3 px-4 rounded-2xl text-xs uppercase tracking-wider text-center cursor-not-allowed border border-gray-200"
                      >
                        Notify Me
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-2xs max-w-md mx-auto my-12">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
              <FavoriteIcon sx={{ fontSize: 32 }} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              Explore our collections and save items you love for later.
            </p>
            <button
              type="button"
              onClick={() => navigate("/product")}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-md"
            >
              Explore Products
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default WishList;
