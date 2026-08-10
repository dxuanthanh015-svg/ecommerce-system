import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import OrderTracker from "./OrderTracker";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";

const orderDetailData = {
  orderId: "NX-8472-91",
  date: "Oct 24, 2024",
  status: "Delivered",
  activeStep: 4, // 0: Placed, 1: Confirmed, 2: Shipped, 3: Out For Delivery, 4: Delivered
  items: [
    {
      id: 1,
      title: "Cashmere Blend Turtleneck",
      color: "Beige",
      size: "M",
      price: 145.00,
      quantity: 1,
      seller: "NexCart Brand",
      imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Leather Chelsea Boots",
      color: "Black",
      size: "42",
      price: 220.00,
      quantity: 1,
      seller: "NexCart Footwear",
      imageUrl: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=600&auto=format&fit=crop"
    }
  ],
  shippingAddress: {
    name: "Jane Doe",
    address: "123 Luxury Ave, Suite 400",
    district: "Manhattan",
    city: "New York, NY 10001",
    phone: "0987 276 292"
  },
  summary: {
    subtotal: 365.00,
    shipping: 0.00,
    tax: 29.20,
    total: 394.20
  }
};

const OrderDetail = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();

  const currentOrderId = orderId || orderDetailData.orderId;

  return (
    <div className="bg-[#f8f9fc]/60 min-h-screen py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <button
          onClick={() => navigate("/account/order")}
          className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors mb-6 cursor-pointer"
        >
          <ArrowBackIcon sx={{ fontSize: 16 }} />
          <span>Back to Orders</span>
        </button>

        {/* Page Title & Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Order #{currentOrderId}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Placed on {orderDetailData.date}
            </p>
          </div>

          <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5 w-fit">
            <CheckCircleOutlinedIcon sx={{ fontSize: 16 }} />
            <span>{orderDetailData.status}</span>
          </span>
        </div>

        {/* Order Tracker Stepper */}
        <OrderTracker activeStep={orderDetailData.activeStep} />

        {/* Main Content 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Product Items List */}
          <div className="lg:col-span-8 space-y-4">
            <h2 className="text-base font-bold text-gray-900 mb-2">
              Items in this Order ({orderDetailData.items.length})
            </h2>

            {orderDetailData.items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-xl border border-gray-100 bg-gray-50 shrink-0"
                  />
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Color: <span className="font-semibold text-gray-700">{item.color}</span> | Size: <span className="font-semibold text-gray-700">{item.size}</span>
                    </p>
                    <p className="text-xs text-gray-400">
                      Seller: {item.seller}
                    </p>
                    <p className="text-sm font-bold text-gray-900 pt-1">
                      ${item.price.toFixed(2)} x {item.quantity}
                    </p>
                  </div>
                </div>

                {/* Rate & Review Button */}
                <button 
                  type="button"
                  className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer shrink-0"
                >
                  <StarBorderIcon sx={{ fontSize: 16 }} />
                  <span>Rate & Review</span>
                </button>
              </div>
            ))}
          </div>

          {/* Right Column: Address & Summary */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Delivery Address Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <LocationOnOutlinedIcon className="text-indigo-600" sx={{ fontSize: 20 }} />
                <h3 className="text-sm font-bold text-gray-900">
                  Delivery Address
                </h3>
              </div>

              <div className="space-y-1 text-xs text-gray-600">
                <p className="font-bold text-gray-900 text-sm">
                  {orderDetailData.shippingAddress.name}
                </p>
                <p>{orderDetailData.shippingAddress.address}</p>
                <p>{orderDetailData.shippingAddress.district}, {orderDetailData.shippingAddress.city}</p>
                <div className="flex items-center gap-1 text-gray-500 pt-2">
                  <LocalPhoneOutlinedIcon sx={{ fontSize: 14 }} />
                  <span>{orderDetailData.shippingAddress.phone}</span>
                </div>
              </div>
            </div>

            {/* Payment Summary Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-gray-900 pb-2 border-b border-gray-100">
                Payment Summary
              </h3>

              <div className="space-y-2.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">${orderDetailData.summary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-bold text-emerald-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span className="font-bold text-gray-900">${orderDetailData.summary.tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                <span className="text-sm font-bold text-gray-900">Total Paid</span>
                <span className="text-base font-extrabold text-indigo-600">${orderDetailData.summary.total.toFixed(2)}</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default OrderDetail;
