import React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

const stepConfig = [
  {
    key: "Pending",
    label: "Order Placed",
    sublabel: "Chờ xác nhận",
    icon: ReceiptLongOutlinedIcon,
  },
  {
    key: "Processing",
    label: "Processing",
    sublabel: "Đang chuẩn bị hàng",
    icon: Inventory2OutlinedIcon,
  },
  {
    key: "Shipped",
    label: "In Transit",
    sublabel: "Đang giao hàng",
    icon: LocalShippingOutlinedIcon,
  },
  {
    key: "Delivered",
    label: "Delivered",
    sublabel: "Đã nhận hàng",
    icon: TaskAltOutlinedIcon,
  },
];

const OrderTracker = ({ status, activeStep }) => {
  const currentStatus = String(status || activeStep || "Pending").trim();
  const normalized = currentStatus.toLowerCase();

  const isCancelled = normalized === "cancelled";

  let indexStep = 0;
  if (normalized === "pending") {
    indexStep = 0;
  } else if (normalized === "processing" || normalized === "packing") {
    indexStep = 1;
  } else if (["shipped", "in transit", "in_transit", "in-transit"].includes(normalized)) {
    indexStep = 2;
  } else if (normalized === "delivered" || normalized === "completed") {
    indexStep = 3;
  }

  if (isCancelled) {
    return (
      <div className="bg-rose-50/70 rounded-2xl p-5 sm:p-6 border border-rose-200/80 shadow-2xs mb-6 font-sans">
        <div className="flex items-center gap-3 text-rose-700">
          <CancelOutlinedIcon sx={{ fontSize: 24 }} />
          <div>
            <h4 className="text-sm font-bold">Đơn hàng đã bị hủy</h4>
            <p className="text-xs text-rose-600 mt-0.5">
              Đơn hàng này đã được hủy và không thể tiếp tục quy trình vận chuyển.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const progressPercent = (indexStep / (stepConfig.length - 1)) * 100;

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-2xs mb-6 font-sans">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">
            ORDER STATUS TRACKER
          </h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Trạng thái hiện tại:{" "}
            <span className="font-bold text-indigo-600 capitalize">
              {stepConfig[indexStep]?.label || currentStatus}
            </span>
          </p>
        </div>
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
          Bước {indexStep + 1} / {stepConfig.length}
        </span>
      </div>

      <div className="relative flex items-center justify-between">
        {/* Background track line */}
        <div className="absolute top-5 left-6 right-6 h-1 bg-gray-100 z-0">
          <div
            className="h-full bg-indigo-600 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Step Nodes */}
        {stepConfig.map((step, index) => {
          const isCompleted = index < indexStep;
          const isCurrent = index === indexStep;
          const StepIcon = step.icon;

          return (
            <div
              key={step.key}
              className="relative z-10 flex flex-col items-center text-center group max-w-28 sm:max-w-32"
            >
              {/* Step Circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isCompleted
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                    : isCurrent
                    ? "bg-white border-2 border-indigo-600 text-indigo-600 ring-4 ring-indigo-50 shadow-md"
                    : "bg-white border-2 border-gray-200 text-gray-400"
                }`}
              >
                {isCompleted ? (
                  <CheckCircleIcon sx={{ fontSize: 20 }} />
                ) : (
                  <StepIcon sx={{ fontSize: 20 }} />
                )}
              </div>

              {/* Step Labels */}
              <div className="mt-3 space-y-0.5">
                <p
                  className={`text-xs font-bold leading-tight ${
                    isCurrent
                      ? "text-indigo-600 font-extrabold"
                      : isCompleted
                      ? "text-gray-900"
                      : "text-gray-400"
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-[10px] text-gray-400 hidden sm:block">
                  {step.sublabel}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTracker;
