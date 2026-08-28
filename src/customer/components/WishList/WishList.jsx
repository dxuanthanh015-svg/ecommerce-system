import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { wishlistService, cartService, authService } from "../../../services";

const WishList = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const loadWishlist = async () => {
    try {
      const user = await authService.getCurrentUser();
      setCurrentUser(user);
      const items = await wishlistService.fetchWishlist(user?.email);
      setWishlist(items || []);
    } catch (err) {
      console.error("Error loading wishlist:", err);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const handleRemoveFromWishlist = async (id) => {
    try {
      const updated = await wishlistService.removeFromWishlist(id, currentUser?.email);
      setWishlist(updated);
    } catch (err) {
      console.error("Error removing from wishlist:", err);
    }
  };

  const handleClearAll = async () => {
    if (window.confirm("Are you sure remove all items in wishlist?")) {
      try {
        await wishlistService.clearWishlist(currentUser?.email);
        setWishlist([]);
      } catch (err) {
        console.error("Error clearing wishlist:", err);
      }
    }
  };

  const handleAddToCart = async (item) => {
    const newItem = {
      id: item.id,
      id_store: item.id_store || item.storeId || "store-001",
      title: item.title,
      price: item.discountedPrice || item.price,
      quantity: 1,
      imageUrl: item.imageUrl,
      color: "Default",
      size: "M",
    };

    if (currentUser?.email) {
      await cartService.addToCart(newItem, currentUser.email);
    } else {
      const currentGuestCart = await cartService.fetchGuestCart();
      const existingIdx = currentGuestCart.findIndex(
        (c) => String(c.id) === String(newItem.id)
      );
      if (existingIdx > -1) {
        currentGuestCart[existingIdx].quantity += 1;
      } else {
        currentGuestCart.unshift(newItem);
      }
      await cartService.saveGuestCart(currentGuestCart);
    }

    alert(`Added "${item.title}" to cart!`);
    navigate("/cart");
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    alert("Link added to clipboard!");
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
              {wishlist.length || 0} item{wishlist.length !== 1 ? "s" : ""} saved for later
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
                <span>Clear All</span>
              </button>
            </div>
          )}
        </div>

        {/* Wishlist Items Grid */}
        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((item) => {
              const price = Number(item.price) || 0;
              const discountedPrice = Number(item.discountedPrice) || price;
              const hasDiscount = discountedPrice < price;

              return (
                <div
                  key={item.id}
                  className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Image Box */}
                    <div
                      className="relative aspect-4/5 w-full bg-gray-50 overflow-hidden cursor-pointer"
                      onClick={() => navigate(`/product/${item.id}`)}
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Remove from wishlist button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFromWishlist(item.id);
                        }}
                        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs text-rose-500 hover:text-white hover:bg-rose-500 shadow-sm flex items-center justify-center transition-all cursor-pointer"
                        title="Remove from wishlist"
                      >
                        <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                      </button>

                      {/* Discount Tag */}
                      {hasDiscount && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-sm">
                          Sale
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="p-4">
                      <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider mb-1">
                        {item.brand || item.category || "Essentials"}
                      </p>
                      <h3
                        onClick={() => navigate(`/product/${item.id}`)}
                        className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors cursor-pointer"
                      >
                        {item.title}
                      </h3>

                      {/* Price row */}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-base font-extrabold text-gray-900">
                          ${discountedPrice.toFixed(2)}
                        </span>
                        {hasDiscount && (
                          <span className="text-xs font-semibold text-gray-400 line-through">
                            ${price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Add To Cart CTA Button */}
                  <div className="p-4 pt-0">
                    <button
                      type="button"
                      onClick={() => handleAddToCart(item)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
                    >
                      <ShoppingBagOutlinedIcon sx={{ fontSize: 16 }} />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-2xs max-w-md mx-auto">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-500">
              <FavoriteIcon sx={{ fontSize: 32 }} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-xs text-gray-500 mb-6 max-w-xs mx-auto">
              Save your favorite items here so you can easily find them later and add them to your cart.
            </p>
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
            >
              <span>Explore Products</span>
              <ArrowForwardIcon sx={{ fontSize: 16 }} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default WishList;
