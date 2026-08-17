import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import QrCodeScannerOutlinedIcon from "@mui/icons-material/QrCodeScannerOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { store_manager_mock_data } from "../../../Data/store-manager_mock_data";

const QrCode = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get order data from navigation state or localStorage
  const pendingOrder = location.state?.order || JSON.parse(localStorage.getItem("pendingOrder")) || {
    orderId: "NX-88291",
    total: 475.20,
    items: JSON.parse(localStorage.getItem("cart")) || []
  };

  // Find store info based on first item's id_store / storeId
  const firstItemStoreId = pendingOrder.items?.[0]?.id_store || pendingOrder.items?.[0]?.storeId || "store-001";
  const storeInfo = store_manager_mock_data.find((s) => s.id === firstItemStoreId) || store_manager_mock_data[0];

  // Timer: 15 minutes (900 seconds)
  const [timeLeft, setTimeLeft] = useState(900);

  useEffect(() => {
    if (timeLeft <= 0) {
      alert("Thời gian thanh toán đã hết hạn. Bạn sẽ được chuyển hướng về trang Checkout.");
      navigate("/checkout");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, navigate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const storeBank = storeInfo.bankInfo.bankName;
  const storeAccount = storeInfo.bankInfo.accountNumber;
  const storeName = storeInfo.bankInfo.accountName;
  const qrData = storeInfo.bankInfo.qrCodeUrl
    ? `${storeInfo.bankInfo.qrCodeUrl}?amount=${Math.round((pendingOrder.total || 0) * 25000)}&addInfo=${pendingOrder.orderId}&accountName=${encodeURIComponent(storeName)}`
    : `https://img.vietqr.io/image/${storeBank}-${storeAccount}-compact2.png?amount=${Math.round((pendingOrder.total || 0) * 25000)}&addInfo=${pendingOrder.orderId}&accountName=${encodeURIComponent(storeName)}`;

  const fallbackQr = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`STORE: ${storeInfo.name} | ORDER: ${pendingOrder.orderId} | AMOUNT: $${pendingOrder.total}`)}`;

  const [qrSrc, setQrSrc] = useState(qrData);

  const handlePaid = () => {
    const existingOrders = JSON.parse(localStorage.getItem("userOrders")) || [];
    const newOrder = {
      orderId: pendingOrder.orderId,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      status: "Processing",
      subtotal: pendingOrder.subtotal,
      tax: pendingOrder.tax,
      total: pendingOrder.total,
      items: pendingOrder.items || [],
      shippingAddress: pendingOrder.address || {},
      extraCount: Math.max(0, (pendingOrder.items?.length || 0) - 2),
    };

    localStorage.setItem("userOrders", JSON.stringify([newOrder, ...existingOrders]));

    // Filter out paid items from full cart
    const fullCart = JSON.parse(localStorage.getItem("cart")) || [];
    const paidItemIds = (pendingOrder.items || []).map((i) => i.id);
    const remainingCart = fullCart.filter((item) => !paidItemIds.includes(item.id));

    localStorage.setItem("cart", JSON.stringify(remainingCart));
    localStorage.removeItem("checkoutCart");
    localStorage.removeItem("pendingOrder");

    navigate("/account/order");
  };

  const handleCancel = () => {
    navigate("/checkout");
  };

  return (
    <div className="bg-[#f4f6fb] min-h-screen py-10 px-4 font-sans flex flex-col items-center justify-center">
      <div className="mb-6 cursor-pointer" onClick={() => navigate("/")}>
        <span className="text-3xl sm:text-4xl font-extrabold text-indigo-600 tracking-tight">
          Nex<span className="text-indigo-900">Cart</span>
        </span>
      </div>

      {/* Main Container Card */}
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative">
        {/* Top Gradient Bar */}
        <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 w-full" />

        <div className="p-6 sm:p-8 flex flex-col items-center">
          {/* Header Icon */}
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
            <QrCodeScannerOutlinedIcon sx={{ fontSize: 28 }} />
          </div>

          {/* Title & Subtitle */}
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1 text-center">
            Scan to Pay
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 text-center max-w-sm mb-6 leading-relaxed">
            Please use your banking app or e-wallet to scan the QR code below.
          </p>

          {/* Order ID & Total Amount Card */}
          <div className="w-full bg-[#f0f4ff] rounded-2xl p-4 flex items-center justify-between mb-6 border border-indigo-100/60">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                ORDER ID
              </span>
              <span className="text-sm font-extrabold text-gray-900">
                #{pendingOrder.orderId}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                TOTAL AMOUNT
              </span>
              <span className="text-lg font-black text-indigo-600">
                ${Number(pendingOrder.total).toFixed(2)}
              </span>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col items-center mb-6 relative group">
            {/* Inner Top Bar */}
            <div className="w-full h-1 bg-indigo-500 rounded-full mb-4" />

            <img
              src={qrSrc}
              onError={() => setQrSrc(fallbackQr)}
              alt="Scan to Pay QR Code"
              className="w-48 h-48 object-contain mb-3 rounded-lg"
            />

            <div className="text-center">
              <span className="text-[11px] font-bold text-gray-800 block">
                Thanh Toán QR ({storeInfo.bankInfo.bankName})
              </span>
              <span className="text-[10px] font-extrabold text-indigo-600 tracking-wide uppercase">
                {storeInfo.name}
              </span>
            </div>
          </div>

          {/* Expire Timer Badge */}
          <div className="bg-rose-50 text-rose-600 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 mb-8 border border-rose-100">
            <AccessTimeOutlinedIcon sx={{ fontSize: 16 }} />
            <span>Payment window expires in <strong className="font-extrabold">{formatTime(timeLeft)}</strong></span>
          </div>

          {/* Instructions */}
          <div className="w-full space-y-3 mb-8">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              INSTRUCTIONS
            </h3>

            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0">
                1
              </span>
              <span className="text-xs text-gray-600 font-medium">
                Open your preferred payment app or e-wallet.
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0">
                2
              </span>
              <span className="text-xs text-gray-600 font-medium">
                Scan the QR code displayed above.
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0">
                3
              </span>
              <span className="text-xs text-gray-600 font-medium">
                Confirm the payment details on your device.
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full space-y-3">
            <button
              onClick={handlePaid}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-indigo-500/25 transition-all cursor-pointer"
            >
              <span>I HAVE PAID</span>
              <ArrowForwardIcon sx={{ fontSize: 16 }} />
            </button>

            <button
              onClick={handleCancel}
              className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold py-3.5 px-4 rounded-2xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              CANCEL PAYMENT
            </button>
          </div>
        </div>
      </div>

      {/* Footer SSL Note */}
      <div className="flex items-center gap-1.5 text-gray-400 text-xs mt-6">
        <LockOutlinedIcon sx={{ fontSize: 14 }} />
        <span>Secure 256-bit SSL Encrypted Payment</span>
      </div>
    </div>
  );
};

export default QrCode;
