import React, { useState, useEffect } from "react";
import { Rating } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useParams } from "react-router-dom";
import { product_detail_data } from "../../../Data/product_detail_data";
import { product_mock_data } from "../../../Data/product_mock_data";
import HomeSectionCarousel from "../Home/HomeSectionCarousel/HomeSectionCarousel";

const relatedProducts = [
  {
    id: 101,
    title: "Classic Tailored Trousers",
    price: 120.00,
    imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 102,
    title: "Mahogany Leather Loafers",
    price: 185.00,
    badge: "NEW",
    imageUrl: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 103,
    title: "Linen Blend Nehru Jacket",
    price: 195.00,
    imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 104,
    title: "Geometric Silk Pocket Square",
    price: 45.00,
    imageUrl: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=600&auto=format&fit=crop"
  }
];

export default function ProductDetails() {
  const { productId } = useParams();
  const product = product_mock_data.find(p => p.id == productId);
  const productRelevant = product_mock_data.filter(p => p.topLavelCategory === product.topLavelCategory && p.secondLavelCategory === product.secondLavelCategory);
  const detailProduct = product_detail_data[productId];
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(detailProduct.colors[0]);
  const [selectedSize, setSelectedSize] = useState("M");
  const [descOpen, setDescOpen] = useState(true);
  const [shippingOpen, setShippingOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  }, [productId]);


  const handleAddToCart = () => {
    if (!product) return;
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const cartItem = {
      id: product.id,
      id_store: product.id_store || "store-001",
      title: product.title,
      color: selectedColor?.name || product.color || "Default",
      size: selectedSize,
      price: product.discountedPrice || product.price,
      quantity: 1,
      imageUrl: product.imageUrl
    };

    const existingItemIndex = cart.findIndex(
      (item) => item.id === cartItem.id && item.size === cartItem.size && item.color === cartItem.color
    );

    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push(cartItem);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    navigate('/cart');
  };

  const handleSaveToWishlist = () => {
    if (!product) return;
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const isAlreadySaved = wishlist.some((item) => String(item.id) === String(product.id));

    if (!isAlreadySaved) {
      const wishlistItem = {
        id: product.id,
        id_store: product.id_store || "store-001",
        title: product.title,
        brand: product.brand || "NexCart",
        price: product.price,
        discountedPrice: product.discountedPrice || product.price,
        imageUrl: product.imageUrl,
        inStock: true,
      };
      localStorage.setItem("wishlist", JSON.stringify([wishlistItem, ...wishlist]));
    }
    navigate("/wishlist");
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 font-medium">
            <li><a href="/" className="hover:text-gray-900 transition-colors">Home</a></li>
            <li><ChevronRightIcon sx={{ fontSize: 16 }} className="text-gray-400" /></li>
            <li><a href="/product" className="hover:text-gray-900 transition-colors">Product</a></li>
            <li><ChevronRightIcon sx={{ fontSize: 16 }} className="text-gray-400" /></li>
            <li className="text-gray-900 font-bold">{product.title}</li>
          </ol>
        </nav>

        {/* Main Product Grid (2 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 pb-16">

          {/* Left Column: Images */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            {/* Large Image */}
            <div className="w-full h-[450px] sm:h-[580px] lg:h-[620px] rounded-xl overflow-hidden bg-gray-50 shadow-xs border border-gray-100">
              <img
                src={detailProduct.images[selectedImage]}
                alt={detailProduct.name}
                className="w-full h-full object-cover object-center transition-all duration-300"
              />
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-3 sm:gap-4">
              {detailProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`h-24 sm:h-28 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${selectedImage === idx
                    ? "border-indigo-600 p-0.5 shadow-sm"
                    : "border-transparent opacity-80 hover:opacity-100"
                    }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover object-center rounded-md" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Product Specs & Ordering */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              {/* Title */}
              <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
                {detailProduct.name}
              </h1>

              {/* Price & Rating */}
              <div className="flex items-center justify-between mb-8">
                <span className="text-xl sm:text-2xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                <div className="flex items-center gap-1.5">
                  <Rating value={detailProduct.rating} precision={0.5} readOnly size="small" sx={{ color: '#6366f1' }} />
                  <span className="text-xs text-gray-500 font-medium">({detailProduct.reviewCount})</span>
                </div>
              </div>

              {/* COLOR Selection */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">COLOR</span>
                  <span className="text-xs font-semibold text-gray-900">{selectedColor.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  {detailProduct.colors.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedColor(c)}
                      className={`w-8 h-8 rounded-full ${c.bg} transition-all cursor-pointer ${selectedColor.id === c.id
                        ? "ring-2 ring-indigo-600 ring-offset-2 scale-110"
                        : "hover:scale-105"
                        }`}
                      aria-label={c.name}
                    />
                  ))}
                </div>
              </div>

              {/* SIZE Selection */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">SIZE</span>
                  <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-2.5">
                  {detailProduct.sizes.map((s) => (
                    <button
                      key={s.name}
                      disabled={!s.inStock}
                      onClick={() => setSelectedSize(s.name)}
                      className={`py-3 rounded-lg text-xs font-bold transition-all border ${selectedSize === s.name
                        ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                        : s.inStock
                          ? "bg-white text-gray-900 border-gray-200 hover:border-gray-400 cursor-pointer"
                          : "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
                        }`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-3 mb-10">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl text-xs sm:text-sm tracking-widest uppercase shadow-lg hover:shadow-indigo-500/25 transition-all cursor-pointer"
                >
                  ADD TO BAG
                </button>
                <button
                  onClick={handleSaveToWishlist}
                  className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-semibold py-3.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <FavoriteBorderIcon sx={{ fontSize: 18 }} />
                  <span>Save to Wishlist</span>
                </button>
              </div>

              {/* Accordions */}
              <div className="border-t border-gray-200 divide-y divide-gray-200">
                {/* Description Accordion */}
                <div className="py-4">
                  <button
                    onClick={() => setDescOpen(!descOpen)}
                    className="w-full flex items-center justify-between text-xs font-bold text-gray-900 uppercase tracking-wider text-left cursor-pointer"
                  >
                    <span>DESCRIPTION</span>
                    {descOpen ? <RemoveIcon sx={{ fontSize: 18 }} /> : <AddIcon sx={{ fontSize: 18 }} />}
                  </button>
                  {descOpen && (
                    <div className="mt-3 space-y-3 text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                      <p>{detailProduct.description}</p>
                      <ul className="space-y-1.5 pt-1">
                        {detailProduct.bullets.map((b, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 inline-block" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Shipping Accordion */}
                <div className="py-4">
                  <button
                    onClick={() => setShippingOpen(!shippingOpen)}
                    className="w-full flex items-center justify-between text-xs font-bold text-gray-900 uppercase tracking-wider text-left cursor-pointer"
                  >
                    <span>SHIPPING & RETURNS</span>
                    {shippingOpen ? <RemoveIcon sx={{ fontSize: 18 }} /> : <AddIcon sx={{ fontSize: 18 }} />}
                  </button>
                  {shippingOpen && (
                    <div className="mt-3 text-xs sm:text-sm text-gray-600 leading-relaxed">
                      <p>Complimentary standard shipping on all orders over $50. Returns accepted within 30 days of purchase date.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* You May Also Like Section */}
        <section className="pt-12 border-t border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 text-center tracking-tight mb-8">
            You May Also Like
          </h2>

          <div >
            <HomeSectionCarousel data={productRelevant} />
          </div>
        </section>

      </div>
    </div>
  );
}

