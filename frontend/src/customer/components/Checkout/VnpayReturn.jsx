import { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { vnpayService } from "../../../services/vnpayService";
import { cartService } from "../../../services/cartService";
import { QUERY_KEYS } from "../../../constants/queryKeys";

export default function VnpayReturn() {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const txnRef = searchParams.get("txnRef");
  const cleared = useRef(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["vnpayPaymentStatus", txnRef],
    queryFn: () => vnpayService.getStatus(txnRef),
    enabled: Boolean(txnRef),
    refetchInterval: (query) => query.state.data?.status === "PENDING" ? 2000 : false,
  });

  useEffect(() => {
    if (data?.status !== "PAID" || cleared.current) return;
    cleared.current = true;
    cartService.clearCart().catch((error) => {
      console.warn("Payment succeeded but cart could not be cleared:", error);
    });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_ORDERS() });
    queryClient.invalidateQueries({ queryKey: ["userOrders"] });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART() });
  }, [data?.status, queryClient]);

  const title = !txnRef || isError
    ? "Không tra được giao dịch"
    : data?.status === "PAID"
      ? "Thanh toán thành công"
      : data?.status === "FAILED" || data?.status === "EXPIRED"
        ? "Thanh toán chưa thành công"
        : "Đang xác nhận thanh toán";

  const description = data?.status === "PAID"
    ? `Đơn ${data.orderCode || "của bạn"} đã được tạo. Cửa hàng sẽ xác nhận đơn.`
    : data?.status === "FAILED" || data?.status === "EXPIRED"
      ? "Giao dịch không hoàn tất. Bạn có thể quay lại checkout và thử lại."
      : isLoading || data?.status === "PENDING"
        ? "VNPAY đã chuyển bạn về website. Hệ thống đang đợi xác nhận giao dịch từ máy chủ thanh toán."
        : "Kiểm tra lại mã giao dịch hoặc đăng nhập bằng tài khoản đã đặt thanh toán.";

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-5 text-center">
      <div className="w-full rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="mt-3 text-gray-600">{description}</p>
        {txnRef && <p className="mt-3 break-all text-xs text-gray-400">Mã giao dịch: {txnRef}</p>}
        {data?.status === "PENDING" && <p className="mt-4 text-sm text-indigo-600">Đang tự kiểm tra trạng thái…</p>}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/account/order" className="rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white">
            Xem đơn hàng
          </Link>
          {(data?.status === "FAILED" || data?.status === "EXPIRED" || isError) && (
            <Link to="/checkout" className="rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700">
              Quay lại thanh toán
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
