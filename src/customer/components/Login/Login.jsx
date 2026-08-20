import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { migrateGuestCartOnLogin } from "../../utils/cartUtils";
import store_manager_mock_data from "../../../Data/store-manager_mock_data";
import { product_mock_data } from "../../../Data/product_mock_data";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const inputEmail = email.trim().toLowerCase();
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];

    // Search for exact matching account in registeredUsers array
    let matchedUser = registeredUsers.find(
      (u) => u.email.trim().toLowerCase() === inputEmail && u.password === password
    );

    // Support demo account if logging in with demo credentials
    if (!matchedUser && inputEmail === "nexcart.user@example.com" && password === "password123") {
      matchedUser = {
        firstName: "Premium",
        lastName: "Member",
        email: "nexcart.user@example.com",
        password: "password123",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
        isVerified: true,
        isManager: true,
        storeId: "store-001"
      };
    }

    if (matchedUser) {
      localStorage.setItem("user", JSON.stringify(matchedUser));
      localStorage.setItem("isLoggedIn", "true");

      // Seed all mock products into localStorage products key if missing
      const existingProducts = JSON.parse(localStorage.getItem("products"));
      if (!existingProducts || existingProducts.length === 0) {
        localStorage.setItem("products", JSON.stringify(product_mock_data));
      } else {
        const existingIds = new Set(existingProducts.map((p) => String(p.id)));
        const missingMock = product_mock_data.filter((p) => !existingIds.has(String(p.id)));
        if (missingMock.length > 0) {
          localStorage.setItem("products", JSON.stringify([...existingProducts, ...missingMock]));
        }
      }

      // Seed & Merge stores (store-001, store-002, store-003 + custom stores)
      const existingStores = JSON.parse(localStorage.getItem("allStores")) || JSON.parse(localStorage.getItem("stores")) || [];
      const existingStoreIds = new Set(existingStores.map((s) => String(s.id)));
      const missingMockStores = store_manager_mock_data.filter((s) => !existingStoreIds.has(String(s.id)));
      const allStores = [...existingStores, ...missingMockStores];

      localStorage.setItem("allStores", JSON.stringify(allStores));
      localStorage.setItem("stores", JSON.stringify(allStores));

      if (matchedUser.isManager) {
        const userStore = allStores.find(
          (s) =>
            String(s.id) === String(matchedUser.storeId) ||
            s.email?.toLowerCase() === matchedUser.email?.toLowerCase()
        ) || allStores[0];
        localStorage.setItem("currentStore", JSON.stringify(userStore));

        const existingProduct = JSON.parse(localStorage.getItem('currentProducts'));

        if (existingProduct == null) {
          const allProducts = JSON.parse(localStorage.getItem("products")) || product_mock_data;
          const initialStoreProducts = allProducts.filter(
            (p) => String(p.id_store || p.storeId) === String(userStore.id)
          );
          localStorage.setItem('currentProducts', JSON.stringify(initialStoreProducts));
        }

        // Synchronize store orderRevenue for all stores
        const allStoreRevenue = JSON.parse(localStorage.getItem("allStoreRevenue")) || {};
        allStores.forEach((s) => {
          if (!allStoreRevenue[s.id]) {
            allStoreRevenue[s.id] = {
              storeId: s.id,
              storeName: s.name || "Store",
              totalRevenue: 0,
              todayRevenue: 0,
              orders: [],
            };
          }
        });

        let storeRevenue = allStoreRevenue[userStore.id];
        if (!storeRevenue) {
          storeRevenue = {
            storeId: userStore.id,
            storeName: userStore.name,
            totalRevenue: 0,
            todayRevenue: 0,
            orders: [],
          };
          allStoreRevenue[userStore.id] = storeRevenue;
        }

        // Recalculate today's revenue
        const todayStr = new Date().toDateString();
        storeRevenue.todayRevenue = (storeRevenue.orders || [])
          .filter((o) => o.date && new Date(o.date).toDateString() === todayStr)
          .reduce((sum, o) => sum + (Number(o.totalAmount) || Number(o.total) || 0), 0);
        storeRevenue.totalRevenue = (storeRevenue.orders || []).reduce(
          (sum, o) => sum + (Number(o.totalAmount) || Number(o.total) || 0),
          0
        );

        allStoreRevenue[userStore.id] = storeRevenue;
        localStorage.setItem("allStoreRevenue", JSON.stringify(allStoreRevenue));
        localStorage.setItem("orderRevenue", JSON.stringify(storeRevenue));
      } else {
        localStorage.removeItem("currentStore");
        localStorage.removeItem("orderRevenue");
      }

      migrateGuestCartOnLogin(matchedUser.email);
      window.dispatchEvent(new Event("userSessionUpdated"));

      alert(`Đăng nhập thành công! Chào mừng ${matchedUser.firstName || "bạn"} quay trở lại.`);
      navigate("/");
    } else {
      alert("Email hoặc mật khẩu không chính xác! Vui lòng kiểm tra lại hoặc Đăng ký tài khoản mới.");
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 bg-cover bg-center relative font-sans"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?q=80&w=1920&auto=format&fit=crop')`
      }}
    >
      {/* Background Soft Overlay */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-[430px] bg-white rounded-3xl shadow-2xl p-8 sm:p-10 border border-white/80 my-8">

        {/* Brand Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-2">
            NexCart
          </h1>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
            Sign In
          </h2>
          <p className="text-xs text-gray-500 font-normal leading-relaxed">
            Welcome back. Enter your details to continue shopping.
          </p>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-2.5 mb-6">
          {/* Google Button */}
          <button
            type="button"
            className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-semibold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-colors cursor-pointer shadow-2xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Apple Button */}
          <button
            type="button"
            className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-semibold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-colors cursor-pointer shadow-2xs"
          >
            <svg className="w-4 h-4 fill-current text-gray-900" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.66-.8 1.11-1.92.99-3.04-.96.04-2.13.64-2.82 1.44-.61.71-1.14 1.86-1 2.97 1.08.08 2.17-.57 2.83-1.37z" />
            </svg>
            <span>Continue with Apple</span>
          </button>

          {/* Shop Button */}
          <button
            type="button"
            className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-semibold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-colors cursor-pointer shadow-2xs"
          >
            <svg className="w-4 h-4 text-indigo-600 fill-current" viewBox="0 0 24 24">
              <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h2v2c0 .55.45 1 1 1s1-.45 1-1V8h6v2c0 .55.45 1 1 1s1-.45 1-1V8h2v12z" />
            </svg>
            <span>Sign In with shop</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <span className="relative bg-white px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            OR EMAIL
          </span>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              className="w-full bg-[#f0f3fa] border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-900 placeholder-gray-400 font-normal transition-all"
            />
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-gray-700 block">
                Password
              </label>
              <a
                href="#"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#f0f3fa] border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl pl-4 pr-10 py-3 text-xs sm:text-sm text-gray-900 placeholder-gray-400 font-normal transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} />
                ) : (
                  <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#1E293B] hover:bg-[#0F172A] text-white font-bold py-3.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md mt-6"

          >
            <span>Sign In</span>
            <ArrowForwardIcon sx={{ fontSize: 16 }} />
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-xs text-gray-500 text-center mt-6">
          Don't have an account?{" "}
          <button
            onClick={() => navigate('/signup')}
            className="text-indigo-600 font-bold hover:underline cursor-pointer bg-transparent border-none p-0 inline font-sans"
          >
            Create an account
          </button>
        </p>

      </div>
    </div>
  );
};

export default Login;
