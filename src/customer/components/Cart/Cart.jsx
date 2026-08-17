import React, { useState, useMemo } from "react";
import CartItem from "./CartItem";
import { useNavigate } from "react-router-dom";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import HomeSectionCarousel from "../Home/HomeSectionCarousel/HomeSectionCarousel";
import { product_mock_data } from "../../../Data/product_mock_data";
import { store_manager_mock_data } from "../../../Data/store-manager_mock_data";

const Cart = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });

  // Group cart items by store
  const storeGroups = useMemo(() => {
    const groups = {};

    items.forEach((item) => {
      const foundProduct = product_mock_data.find((p) => String(p.id) === String(item.id));
      const storeId = item.id_store || item.storeId || foundProduct?.id_store || "store-001";

      if (!groups[storeId]) {
        const storeInfo = store_manager_mock_data.find((s) => s.id === storeId) || {
          id: storeId,
          name: "NexCart Official Store",
          rating: 4.9,
        };
        groups[storeId] = {
          store: storeInfo,
          items: [],
        };
      }
      groups[storeId].items.push({ ...item, id_store: storeId });
    });

    return Object.values(groups);
  }, [items]);

  // Selected store for current checkout (defaults to first available store)
  const [selectedStoreId, setSelectedStoreId] = useState(() => {
    if (items.length > 0) {
      return items[0].id_store || items[0].storeId || "store-001";
    }
    return "store-001";
  });

  // Active store group
  const activeStoreGroup = storeGroups.find((g) => g.store.id === selectedStoreId) || storeGroups[0];
  const checkoutItems = activeStoreGroup ? activeStoreGroup.items : [];

  const relevantProduct = () => {
    if (!items || items.length === 0) {
      return product_mock_data.slice(0, 10);
    }
    const lastProduct = items[items.length - 1];
    if (!lastProduct || !lastProduct.id) {
      return product_mock_data.slice(0, 10);
    }
    const category = product_mock_data.find((item) => String(item.id) === String(lastProduct.id));
    if (!category || !category.topLavelCategory) {
      return product_mock_data.slice(0, 10);
    }
    return product_mock_data.filter((item) => item.topLavelCategory === category.topLavelCategory);
  };

  const handleRemoveItem = (id) => {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const handleUpdateQuantity = (id, newQty) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, quantity: newQty } : item
    );
    setItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const handleCheckOut = () => {
    if (checkoutItems.length === 0) {
      alert("Giỏ hàng của bạn đang trống!");
      return;
    }
    localStorage.setItem("checkoutCart", JSON.stringify(checkoutItems));
    navigate("/checkout?step=1");
  };

  const subtotal = checkoutItems.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
  const totalCartCount = items.length;

  return (
    <div className="bg-[#f8f9fa]/50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Your Shopping Cart ({totalCartCount})
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Items are grouped by store. Select a store to proceed to checkout.
            </p>
          </div>

          {storeGroups.length > 1 && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3.5 py-2 rounded-xl flex items-center gap-2">
              <InfoOutlinedIcon sx={{ fontSize: 16 }} />
              <span>You have items from <strong>{storeGroups.length} different stores</strong>. Select one store to checkout at a time.</span>
            </div>
          )}
        </div>

        {/* Main 2-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

          {/* Left Column: Cart Items Grouped by Store */}
          <div className="lg:col-span-8 space-y-6">
            {storeGroups.length > 0 ? (
              storeGroups.map((group) => {
                const isSelectedStore = (activeStoreGroup?.store.id === group.store.id);
                const groupSubtotal = group.items.reduce((acc, i) => acc + i.price * (i.quantity || 1), 0);

                return (
                  <div
                    key={group.store.id}
                    className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all ${
                      isSelectedStore
                        ? "border-2 border-indigo-600 shadow-md bg-indigo-50/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {/* Store Header Bar */}
                    <div
                      onClick={() => setSelectedStoreId(group.store.id)}
                      className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100 cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="storeSelection"
                          checked={isSelectedStore}
                          onChange={() => setSelectedStoreId(group.store.id)}
                          className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                          <StorefrontOutlinedIcon sx={{ fontSize: 20 }} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-sm sm:text-base font-bold text-gray-900">
                              {group.store.name}
                            </h2>
                            <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                              ★ {group.store.rating || 4.9}
                            </span>
                          </div>
                          <span className="text-[11px] text-gray-400">
                            {group.items.length} item{group.items.length > 1 ? "s" : ""} from this shop
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-gray-400 block font-medium">Shop Total</span>
                        <span className="text-sm font-extrabold text-gray-900">
                          ${groupSubtotal.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Store Items List */}
                    <div className="space-y-4">
                      {group.items.map((item) => (
                        <CartItem
                          key={item.id}
                          item={item}
                          onRemove={handleRemoveItem}
                          onUpdateQuantity={handleUpdateQuantity}
                        />
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-xs">
                <p className="text-gray-500 font-medium mb-4">Your cart is currently empty.</p>
                <button
                  onClick={() => navigate("/product")}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                >
                  Explore Products
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary for Selected Store */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-100 shadow-xs sticky top-8 space-y-5">
              <div className="pb-3 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">
                  Order Summary
                </h2>
                {activeStoreGroup && (
                  <p className="text-xs text-indigo-600 font-semibold mt-0.5 truncate">
                    Shop: {activeStoreGroup.store.name}
                  </p>
                )}
              </div>

              <div className="space-y-3.5 text-xs sm:text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Selected Items ({checkoutItems.length})</span>
                  <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-500 font-medium">Calculated at checkout</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-500 font-medium">Calculated at checkout</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-base font-bold text-gray-900">Total</span>
                  <span className="text-lg font-black text-indigo-600">${subtotal.toFixed(2)}</span>
                </div>

                <button
                  onClick={handleCheckOut}
                  disabled={checkoutItems.length === 0}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-bold py-4 rounded-xl text-xs sm:text-sm tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/25 transition-all cursor-pointer"
                >
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowForwardIcon sx={{ fontSize: 16 }} />
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 mt-4">
                  <LockOutlinedIcon sx={{ fontSize: 14 }} />
                  <span>Secure checkout powered by NexCart</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* You May Also Like Section */}
        <section className="pt-16 mt-12 border-t border-gray-200/80">
          <h2 className="text-2xl font-bold text-gray-900 text-center tracking-tight mb-8">
            You May Also Like
          </h2>

          <div>
            <HomeSectionCarousel data={relevantProduct()} />
          </div>
        </section>

      </div>
    </div>
  );
};

export default Cart;
