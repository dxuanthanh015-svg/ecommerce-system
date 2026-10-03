import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import QrCodeScannerOutlinedIcon from "@mui/icons-material/QrCodeScannerOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { store_manager_mock_data } from "../../../Data/store-manager_mock_data";
import { useCurrentUser } from "../../../hooks/useAuthQuery";
import { useAllStores } from "../../../hooks/useStoreQuery";
import { useProcessOrder } from "../../../hooks/useOrderQuery";
import { useUpdateVoucher, useVoucherByCode } from "../../../hooks/useVoucherQuery";
import { useAddManyCart, useCart, useGuestCart } from "../../../hooks/useCartQuery";
import toast from "react-hot-toast";

const QrCode = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const pendingOrder = useMemo(() => {
    return (
      location.state?.order || {
        orderId: `NX-${Math.floor(10000 + Math.random() * 90000)}`,
        total: 475.20,
        items: [],
      }
    );
  }, [location.state?.order]);

  const { data: currentUser, isLoading: isUserLoading } = useCurrentUser();
  const { data: allStores = store_manager_mock_data } = useAllStores();
  const [isProcessing, setIsProcessing] = useState(false);
  const { mutateAsync: processOrder } = useProcessOrder();
  const { mutateAsync: updateVoucher } = useUpdateVoucher();
  const { data: cartItems = [] } = useCart(currentUser?.email, { enabled: Boolean(currentUser?.email) });
  const { mutateAsync: addManyCartItem } = useAddManyCart();
  const { data: guestCart = [] } = useGuestCart({ enabled: !currentUser?.email && !isUserLoading });
  const voucherStoreId = pendingOrder.items?.[0]?.storeId || pendingOrder.items?.[0]?.id_store || "store-001";
  const { data: voucherInfo = {} } = useVoucherByCode(pendingOrder.voucherCode, voucherStoreId);

  const firstItemStoreId = pendingOrder.items?.[0]?.id_store || pendingOrder.items?.[0]?.storeId || "store-001";
  const safeStores = Array.isArray(allStores) ? allStores : [];
  const storeInfo = safeStores.find((s) => String(s.id) === String(firstItemStoreId)) || safeStores[0] || {};

  // Timer: 15 minutes (900 seconds)
  const [timeLeft, setTimeLeft] = useState(900);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          toast.error("Thời gian thanh toán đã hết hạn!", { duration: 5000 });
          navigate("/checkout");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const storeBank = storeInfo?.bankInfo?.bankName || "MBBank";
  const storeAccount = storeInfo?.bankInfo?.accountNumber || "0000123456789";
  const storeName = storeInfo?.bankInfo?.accountName || storeInfo?.name || "STORE OWNER";
  const qrData = storeInfo?.bankInfo?.qrCodeUrl
    ? `${storeInfo.bankInfo.qrCodeUrl}?amount=${Math.round((pendingOrder.total || 0) * 25000)}&addInfo=${pendingOrder.orderId}&accountName=${encodeURIComponent(storeName)}`
    : `https://img.vietqr.io/image/${storeBank}-${storeAccount}-compact2.png?amount=${Math.round((pendingOrder.total || 0) * 25000)}&addInfo=${pendingOrder.orderId}&accountName=${encodeURIComponent(storeName)}`;

  const fallbackQr = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`STORE: ${storeInfo?.name} | ORDER: ${pendingOrder.orderId} | AMOUNT: $${pendingOrder.total}`)}`;

  const [hasImgError, setHasImgError] = useState(false);
  const qrSrc = hasImgError ? fallbackQr : qrData;

  useEffect(() => {
    setHasImgError(false);
  }, [qrData]);

  const handlePaid = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      // 1. Process order and store revenue tracking on Mock Server
      await processOrder({ pendingOrder, currentUser });

      // 2. Consume voucher if used
      if (pendingOrder.voucherCode && pendingOrder.discountAmount > 0) {
        // Fetch voucher to get its ID then update usedCount
        if (voucherInfo) {
          await updateVoucher({
            voucherId: voucherInfo.id || voucherInfo._id,
            updateData: {
              usedCount: (Number(voucherInfo.usedCount) || 0) + 1,
              totalDiscountGiven: (Number(voucherInfo.totalDiscountGiven) || 0) + pendingOrder.discountAmount,
            }
          });
        }
      }

      // 3. Remove paid items from user cart
      const paidItems = pendingOrder.items || [];
      if (currentUser?.email) {
        const currentCart = cartItems;
        const remaining = currentCart.filter((item) => {
          return !paidItems.some(
            (paid) => String(paid.id) === String(item.id) && (paid.size || "M") === (item.size || "M")
          );
        });
        await addManyCartItem({ items: remaining, userEmail: currentUser?.email });
      } else {
        const remaining = guestCart.filter((item) => {
          return !paidItems.some(
            (paid) => String(paid.id) === String(item.id) && (paid.size || "M") === (item.size || "M")
          );
        });
        await addManyCartItem({ items: remaining, userEmail: null });
      }

      toast.success(`Đơn hàng ${pendingOrder.orderId} đã thanh toán thành công!`);
      navigate("/account/order");
    } catch (err) {
      console.error("Error processing order payment:", err);
      toast.error("Đơn hàng xử lý thất bại: " + err.message);
    } finally {
      setIsProcessing(false);
    }
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
        <div className="h-2.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        <div className="p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold mb-2">
              <QrCodeScannerOutlinedIcon sx={{ fontSize: 16 }} />
              <span>VietQR Instant Payment</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              Quét Mã Để Thanh Toán
            </h1>
            <p className="text-xs text-gray-500">
              Mở ứng dụng ngân hàng bất kỳ để quét mã QR và thanh toán tự động
            </p>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center justify-center gap-2 bg-amber-50/80 border border-amber-200/60 rounded-2xl py-2.5 px-4 text-amber-800 text-xs font-bold">
            <AccessTimeOutlinedIcon sx={{ fontSize: 16 }} />
            <span>Mã QR sẽ hết hạn sau:</span>
            <span className="text-sm font-black text-amber-900 font-mono tracking-wider">
              {formatTime(timeLeft)}
            </span>
          </div>

          {/* QR Code Container */}
          <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-b from-gray-50/80 to-white rounded-3xl border border-gray-100 shadow-2xs relative group">
            <div className="relative p-3 bg-white rounded-2xl shadow-md border border-gray-200/80">
              <img
                src={qrSrc}
                alt="VietQR Payment Code"
                className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-xl"
                onError={() => {
                  if (!hasImgError) {
                    setHasImgError(true);
                  }
                }}
              />
              <div className="absolute inset-0 border-2 border-indigo-600/20 rounded-2xl pointer-events-none" />
            </div>

            <p className="text-[11px] font-semibold text-gray-400 mt-3">
              Mã giao dịch: <span className="font-mono font-bold text-gray-700">{pendingOrder.orderId}</span>
            </p>
          </div>

          {/* Bank Transfer Details Box */}
          <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100 space-y-2.5 text-xs">
            <div className="flex justify-between items-center text-gray-500">
              <span>Ngân hàng thụ hưởng:</span>
              <span className="font-bold text-gray-900">{storeBank}</span>
            </div>
            <div className="flex justify-between items-center text-gray-500">
              <span>Chủ tài khoản:</span>
              <span className="font-bold text-gray-900 uppercase">{storeName}</span>
            </div>
            <div className="flex justify-between items-center text-gray-500">
              <span>Số tài khoản:</span>
              <span className="font-bold font-mono text-gray-900">{storeAccount}</span>
            </div>
            <div className="flex justify-between items-center text-gray-500">
              <span>Số tiền thanh toán:</span>
              <span className="font-extrabold text-indigo-600 text-sm">
                ${Number(pendingOrder.total || 0).toFixed(2)}
                <span className="text-[10px] text-gray-400 font-normal ml-1">
                  (~{Math.round((pendingOrder.total || 0) * 25000).toLocaleString('vi-VN')} VND)
                </span>
              </span>
            </div>
            <div className="flex justify-between items-center text-gray-500">
              <span>Nội dung chuyển khoản:</span>
              <span className="font-bold font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                {pendingOrder.orderId}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handlePaid}
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white py-3.5 px-6 rounded-xl font-bold text-xs shadow-md shadow-indigo-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <LockOutlinedIcon sx={{ fontSize: 16 }} />
              <span>{isProcessing ? "ĐANG XÁC NHẬN..." : "TÔI ĐÃ HOÀN TẤT CHUYỂN KHOẢN"}</span>
              <ArrowForwardIcon sx={{ fontSize: 16 }} />
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="w-full py-2.5 text-xs font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition cursor-pointer"
            >
              Hủy thanh toán và quay lại
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default QrCode;
