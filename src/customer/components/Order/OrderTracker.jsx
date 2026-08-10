import React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

const steps = [
  "Placed",
  "Confirmed",
  "Shipped",
  "Out For Delivery",
  "Delivered"
];

const OrderTracker = ({ activeStep = 3 }) => {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-2xs mb-8">
      <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-6">
        ORDER STATUS TRACKER
      </h3>

      <div className="relative flex items-center justify-between">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-gray-100 z-0">
          <div
            className="h-full bg-indigo-600 transition-all duration-500"
            style={{
              width: `${(Math.min(activeStep, steps.length - 1) / (steps.length - 1)) * 100}%`
            }}
          />
        </div>

        {/* Steps */}
        {steps.map((label, index) => {
          const isCompleted = index <= activeStep;
          const isCurrent = index === activeStep;

          return (
            <div key={label} className="relative z-10 flex flex-col items-center group">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                isCompleted
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                  : "bg-white border-2 border-gray-200 text-gray-400"
              }`}>
                {isCompleted ? (
                  <CheckCircleIcon sx={{ fontSize: 18 }} />
                ) : (
                  <span className="text-xs font-bold">{index + 1}</span>
                )}
              </div>

              <span className={`text-[11px] font-bold mt-2 text-center max-w-[80px] ${
                isCurrent
                  ? "text-indigo-600 font-extrabold"
                  : isCompleted
                  ? "text-gray-900"
                  : "text-gray-400 font-normal"
              }`}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTracker;