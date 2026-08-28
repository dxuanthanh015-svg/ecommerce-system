import React, { useState, useMemo, useEffect } from "react";
import CartItem from "./CartItem";
import { useNavigate } from "react-router-dom";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import HomeSectionCarousel from "../Home/HomeSectionCarousel/HomeSectionCarousel";
import { product_mock_data } from "../../../Data/product_mock_data";
import { store_manager_mock_data } from "../../../Data/store-manager_mock_data";
import { cartService, storeService, productService, authService } from "../../../services";

const Cart = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [allProducts, setAllProducts] = useState(product_mock_data);
  const [allStores, setAllStores] = useState(store_manager_mock_data);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadCartData = async () => {
    try {
      setLoading(true);
      const [user, prods, stores] = await Promise.all([
        authService.getCurrentUser(),
        productService.fetchProducts(),
        storeService.fetchAllStores(),
      ]);

      setCurrentUser(user);
      if (prods && prods.length > 0) setAllProducts(prods);
      if (stores && stores.length > 0) setAllStores([...stores, ...store_manager_mock_data]);

      let cartItems = [];
      if (user?.email) {
        cartItems = await cartService.fetchCart(user.email);
      } else {
        cartItems = await cartService.fetchGuestCart();
      }
      setItems(cartItems || []);
    } catch (err) {
      console.error("Error loading cart data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCartData();
  }, []);

  // Group cart items by store
  const storeGroups = useMemo(() => {
    const groups = {};

    items.forEach((item) => {
      const foundProduct = allProducts.find((p) => String(p.id) === String(item.id));
      const storeId = item.id_store || item.storeId || foundProduct?.id_store || foundProduct?.storeId || "store-001";

      if (!groups[storeId]) {
        const storeInfo = allStores.find((s) => String(s.id) === String(storeId)) || {
          id: storeId,
          name: foundProduct?.brand || "Official Partner Store",
          rating: 5.0,
        };
        groups[storeId] = {
          store: storeInfo,
          items: [],
        };
      }
      groups[storeId].items.push({ ...item, id_store: storeId });
    });

    return Object.values(groups);
  }, [items, allProducts, allStores]);

  // Selected store for current checkout
  const [selectedStoreId, setSelectedStoreId] = useState("store-001");

  useEffect(() => {
    if (items.length > 0 && (!selectedStoreId || selectedStoreId === "store-001")) {
      const firstId = items[0].id_store || items[0].storeId || "store-001";
      setSelectedStoreId(firstId);
    }
  }, [items]);

  // Active store group
  const activeStoreGroup = storeGroups.find((g) => g.store.id === selectedStoreId) || storeGroups[0];
  const checkoutItems = activeStoreGroup ? activeStoreGroup.items : [];

  const relevantProduct = () => {
    if (!items || items.length === 0) {
      return allProducts.slice(0, 10);
    }
    const lastProduct = items[items.length - 1];
    if (!lastProduct || !lastProduct.id) {
      return allProducts.slice(0, 10);
    }
    const category = allProducts.find((item) => String(item.id) === String(lastProduct.id));
    if (!category || !category.topLavelCategory) {
      return allProducts.slice(0, 10);
    }
    return allProducts.filter((item) => item.topLavelCategory === category.topLavelCategory);
  };

  const handleRemoveItem = async (id, size, color) => {
    let updated;
    if (currentUser?.email) {
      updated = await cartService.removeFromCart(id, size || "M", color || "Default", currentUser.email);
    } else {
      const guestCart = await cartService.fetchGuestCart();
      updated = guestCart.filter((item) => String(item.id) !== String(id));
      await cartService.saveGuestCart(updated);
    }
    setItems(updated || []);
  };

  const handleUpdateQuantity = async (id, size, color, newQty) => {
    let updated;
    if (currentUser?.email) {
      updated = await cartService.updateCartItem(id, size || "M", color || "Default", newQty, currentUser.email);
    } else {
      const guestCart = await cartService.fetchGuestCart();
      updated = guestCart.map((item) =>
        String(item.id) === String(id) ? { ...item, quantity: newQty } : item
      ).filter((item) => item.quantity > 0);
      await cartService.saveGuestCart(updated);
    }
    setItems(updated || []);
  };

  const handleCheckOut = () => {
    if (checkoutItems.length === 0) {
      alert("Giỏ hàng của bạn đang trống!");
      return;
    }
    navigate("/checkout?step=1", { state: { checkoutItems } });
  };

  const subtotal = checkoutItems.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
  const totalCartCount = items.length;

  return (
    <div className="bg-[#f8f9fa]/50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-8 pb-4 border-b border-gray-100">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Shopping Cart
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              You have <span className="font-bold text-indigo-600">{totalCartCount}</span> items in your cart ({storeGroups.length} different store{storeGroups.length !== 1 ? 's' : ''})
            </p>
          </div>
          <button
            onClick={() => navigate('/products')}
            className="mt-3 sm:mt-0 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer"
          >
            ← Continue Shopping
          </button>
        </div>

        {/* Multi-Store Selector Tabs (if more than 1 store) */}
        {storeGroups.length > 1 && (
          <div className="mb-6 bg-white p-4 rounded-2xl border border-indigo-100 shadow-2xs">
            <div className="flex items-center gap-2 mb-3">
              <StorefrontOutlinedIcon sx={{ fontSize: 18 }} className="text-indigo-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                Select Store to Checkout:
              </h3>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {storeGroups.map((group) => {
                const isSelected = (selectedStoreId || storeGroups[0].store.id) === group.store.id;
                const groupCount = group.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
                return (
                  <button
                    key={group.store.id}
                    type="button"
                    onClick={() => setSelectedStoreId(group.store.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${isSelected
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20 scale-[1.02]"
                      : "bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200"
                      }`}
                  >
                    <span>{group.store.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${isSelected ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700"
                      }`}>
                      {groupCount} items
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Grid: Cart Items List + Order Summary */}
        {checkoutItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

            {/* Left Column: Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {/* Current Active Store Label */}
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <h2 className="text-sm font-extrabold text-gray-900">
                    Items from {activeStoreGroup?.store?.name || "Selected Store"}
                  </h2>
                </div>
                <span className="text-xs text-gray-400 font-medium">
                  {checkoutItems.length} products
                </span>
              </div>

              {checkoutItems.map((item) => (
                <CartItem
                  key={`${item.id}-${item.size}-${item.color}`}
                  item={item}
                  onRemove={() => handleRemoveItem(item.id, item.size, item.color)}
                  onUpdateQuantity={(newQty) => handleUpdateQuantity(item.id, item.size, item.color, newQty)}
                />
              ))}
            </div>

            {/* Right Column: Order Summary Card */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-100 shadow-2xs sticky top-8 space-y-6">
                <h2 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100">
                  Order Summary
                </h2>

                <div className="space-y-3.5 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Store Name</span>
                    <span className="font-bold text-gray-900">{activeStoreGroup?.store?.name}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Estimated Shipping</span>
                    <span className="font-bold text-emerald-600">
                      {subtotal > 500 ? `$${(subtotal * 0.005).toFixed(2)}` : "Free"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Estimated Tax (8%)</span>
                    <span className="font-bold text-gray-900">${(subtotal * 0.08).toFixed(2)}</span>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
                    <span className="text-sm font-extrabold text-gray-900">Total</span>
                    <span className="text-xl font-black text-indigo-600">
                      ${(subtotal + (subtotal > 500 ? subtotal * 0.005 : 0) + (subtotal * 0.08)).toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCheckOut}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white py-3.5 px-6 rounded-xl font-bold text-xs shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
                >
                  <LockOutlinedIcon sx={{ fontSize: 16 }} />
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowForwardIcon sx={{ fontSize: 16 }} />
                </button>
              </div>
            </div>

          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-2xs max-w-md mx-auto my-8">
            <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 font-bold text-xl">
              🛒
            </div>
            <h3 className="text-lg font-extrabold text-gray-900 mb-2">Giỏ hàng của bạn đang trống</h3>
            <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed mb-6">
              Hãy khám phá các sản phẩm tuyệt vời trên sàn và thêm vào giỏ hàng ngay!
            </p>
            <button
              onClick={() => navigate('/products')}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 px-6 rounded-xl shadow-md shadow-indigo-500/20 transition cursor-pointer"
            >
              <span>Tiếp tục mua sắm</span>
              <ArrowForwardIcon sx={{ fontSize: 16 }} />
            </button>
          </div>
        )}

        {/* Carousel: Other Products */}
        <div className="mt-16 pt-10 border-t border-gray-100">
          <div className="mb-6">
            <h2 className="text-xl font-extrabold text-gray-900">You Might Also Like</h2>
            <p className="text-xs text-gray-500 mt-0.5">Explore recommended trending products</p>
          </div>
          <HomeSectionCarousel data={relevantProduct()} />
        </div>

      </div>
    </div>
  );
};

export default Cart;
