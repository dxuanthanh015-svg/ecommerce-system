import React, { useState } from "react";
import CartItem from "./CartItem";
import { useNavigate } from "react-router-dom";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const initialCartItems = [
  {
    id: 1,
    title: "Cashmere Blend Turtleneck",
    color: "Beige",
    size: "M",
    price: 145.00,
    quantity: 1,
    imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Leather Chelsea Boots",
    color: "Black",
    size: "42",
    price: 220.00,
    quantity: 1,
    imageUrl: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=600&auto=format&fit=crop"
  }
];

const cartRelatedProducts = [
  {
    id: 201,
    title: "Classic Trench Coat",
    price: 295.00,
    imageUrl: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 202,
    title: "Minimalist Watch",
    price: 180.00,
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 203,
    title: "Structured Tote",
    price: 310.00,
    imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 204,
    title: "Classic Sunglasses",
    price: 125.00,
    imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=600&auto=format&fit=crop"
  }
];

const Cart = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState(initialCartItems);

  const handleRemoveItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleCheckOut = () => {
    navigate("/checkout?step=1");
  };

  const subtotal = items.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

  return (
    <div className="bg-[#f8f9fa]/50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">
          Your Cart ({items.length})
        </h1>

        {/* Main 2-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {items.length > 0 ? (
              items.map((item) => (
                <CartItem key={item.id} item={item} onRemove={handleRemoveItem} />
              ))
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-xs">
                <p className="text-gray-500 font-medium mb-4">Your cart is currently empty.</p>
                <button
                  onClick={() => navigate('/product')}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors"
                >
                  Explore Products
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-100 shadow-xs sticky top-8 space-y-5">
              <h2 className="text-lg font-bold text-gray-900 pb-2 border-b border-gray-100">
                Order Summary
              </h2>

              <div className="space-y-3.5 text-xs sm:text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal</span>
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
                  <span className="text-lg font-bold text-gray-900">${subtotal.toFixed(2)}</span>
                </div>

                <button
                  onClick={handleCheckOut}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl text-xs sm:text-sm tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/25 transition-all cursor-pointer"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cartRelatedProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/product/${p.id}`)}
                className="group cursor-pointer flex flex-col bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="relative h-[270px] w-full bg-[#f8f9fa] flex items-center justify-center p-4 overflow-hidden">
                  <img
                    src={p.imageUrl}
                    alt={p.title}
                    className="object-contain h-full w-full group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                </div>
                <div className="p-4 flex flex-col justify-between bg-white">
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm font-bold text-gray-900">
                    ${p.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Cart;

  