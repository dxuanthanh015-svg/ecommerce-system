import React, { useState, useEffect } from "react";
import { Rating } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import HomeSectionCarousel from "../Home/HomeSectionCarousel/HomeSectionCarousel";
import StoreInformation from "./StoreInformation";
import RateAndReview from "./RateAndReview";
import { useCurrentUser } from "../../../hooks/useAuthQuery";
import { useProducts, useDetailProducts } from "../../../hooks/useProductQuery";
import { useAllStores } from "../../../hooks/useStoreQuery";
import { useAddCart, useAddToWishList } from "../../../hooks/useCartQuery";
import { useReviews } from "../../../hooks/useReviewQuery";
import toast from "react-hot-toast";
import { formatVnd } from "../../../utils/currency";

export default function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();

  // Lấy dữ liệu từ reactquery
  const { data: currentUser } = useCurrentUser();
  const { data: foundProduct } = useDetailProducts(productId);
  const { data: allProds = [] } = useProducts();
  const { data: stores = [] } = useAllStores();
  const { data: reviewsList = [] } = useReviews(productId);

  // 2. Mutation
  const { mutateAsync: addToCartMutate, isPending: isAddingCart } = useAddCart();
  const { mutateAsync: addToWishListMutate } = useAddToWishList();

  // 3. State
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectImage, setSelectImage] = useState(0);

  // Sản phẩm hiện tại 
  const product = foundProduct || allProds.find(p => String(p.id) === String(productId));

  // Xác định thông tin Store của sản phẩm
  const storeId = product?.id_store || product?.storeId || product?.store?.id;
  const safeStores = Array.isArray(stores) ? stores : [];
  const store = storeId
    ? safeStores.find((candidate) => String(candidate.id) === String(storeId)) || null
    : null;

  // Sản phẩm cùng shop và sản phẩm tương tự
  const storeProducts = allProds.filter(p => String(p.id_store || p.storeId || p.store?.id) === String(storeId) && String(p.id) !== String(product?.id));
  const currentCategory = product?.category?.id || product?.categoryId || product?.topLavelCategory;
  const productRelevant = allProds.filter(p => {
    const category = p?.category?.id || p?.categoryId || p?.topLavelCategory;
    return category && category === currentCategory && String(p.id) !== String(product?.id);
  });

  useEffect(() => {
    setSelectImage(0);
  }, [product?.id]);

  const extraDetail = {};
  const originalPrice = Number(product?.price ?? extraDetail.price ?? 0) || 0;
  const discountedPriceValue = product?.discountedPrice ?? extraDetail.discountedPrice;
  const discountedPrice = discountedPriceValue == null || discountedPriceValue === "" || !Number.isFinite(Number(discountedPriceValue))
    ? originalPrice
    : Number(discountedPriceValue);
  const calculatedDiscountPercent = originalPrice > discountedPrice
    ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
    : 0;
  const productImages = [...new Set([
    ...(Array.isArray(product?.images) ? product.images : []),
    product?.imageUrl,
  ].filter((image) => typeof image === "string" && image.trim()))];

  const detailProduct = {
    name: product?.title || extraDetail.title || "Product Details",
    title: product?.title || extraDetail.title || "Product Details",
    brand: product?.brand || extraDetail.brand || "NexCart",
    price: originalPrice,
    discountedPrice,
    discountPersent: Number(product?.discountPersent || extraDetail.discountPersent) || calculatedDiscountPercent,
    rating: Number(product?.rating) || 0,
    reviewCount: Number(product?.reviewCount) || 0,
    description: extraDetail.description || product?.description || "High quality product from NexCart Store.",
    bullets: (extraDetail.bullets && extraDetail.bullets.length > 0)
      ? extraDetail.bullets
      : [
        `100% Authentic product by ${product?.brand || extraDetail.brand || "NexCart"}`,
        "Fast & secure shipping nationwide",
        "Easy 30-day return policy"
      ],
    colors: (extraDetail.colors && extraDetail.colors.length > 0)
      ? extraDetail.colors
      : [
        { id: "c1", name: product?.color || "Default", bg: "bg-gray-900" }
      ],
    sizes: (extraDetail.sizes && extraDetail.sizes.length > 0)
      ? extraDetail.sizes.map((s) => ({
        name: typeof s === "string" ? s : s.name,
        inStock: typeof s === "string" ? true : (s.inStock !== undefined ? s.inStock : (s.quantity > 0)),
        quantity: typeof s === "string" ? 10 : (s.quantity !== undefined ? s.quantity : 10),
      }))
      : (product?.size && Array.isArray(product.size) && product.size.length > 0)
        ? product.size.map((s) => ({
          name: typeof s === "string" ? s : s.name,
          inStock: typeof s === "string" ? true : (s.quantity > 0),
          quantity: typeof s === "string" ? 10 : s.quantity,
        }))
        : [
          { name: "S", inStock: true, quantity: 10 },
          { name: "M", inStock: true, quantity: 15 },
          { name: "L", inStock: true, quantity: 12 },
          { name: "XL", inStock: false, quantity: 0 },
        ],
    images: productImages,
  };

  const currentSizeObj = detailProduct.sizes.find(
    (s) => s.name === (selectedSize || detailProduct.sizes[0]?.name)
  );
  const maxStockForSelectedSize = currentSizeObj?.quantity !== undefined
    ? Number(currentSizeObj.quantity)
    : (product?.quantity !== undefined ? Number(product.quantity) : 10);

  const handleDecreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncreaseQuantity = () => {
    if (quantity < maxStockForSelectedSize) {
      setQuantity(quantity + 1);
    } else {
      toast(`Chỉ còn ${maxStockForSelectedSize} sản phẩm size "${selectedSize || detailProduct.sizes[0]?.name}"!`, { icon: '⚠️' });
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    const finalSize = selectedSize || detailProduct.sizes[0]?.name || "M";
    const finalColor = selectedColor || detailProduct.colors[0]?.name || "Default";

    const newItem = {
      id: product.id,
      productId: product.id,
      id_store: product.id_store || product.storeId || "store-001",
      title: detailProduct.title,
      brand: detailProduct.brand,
      price: Number(detailProduct.price) || 0,
      discountedPrice: Number(detailProduct.discountedPrice) > 0 && Number(detailProduct.discountedPrice) < Number(detailProduct.price)
        ? Number(detailProduct.discountedPrice)
        : Number(detailProduct.price) || 0,
      quantity,
      size: finalSize,
      color: finalColor,
      imageUrl: detailProduct.images[0] || product.imageUrl,
    };

    addToCartMutate({ newItem: newItem, userEmail: currentUser?.email },
      {
        onSuccess: () => navigate('/cart'),
        onError: () => toast.error("Thêm vào giỏ hàng thất bại!")
      }
    );
  };

  const handleSaveToWishlist = async () => {
    if (!product) return;
    addToWishListMutate({ product, userEmail: currentUser?.email },
      {
        onSuccess: () => navigate('/wishlist'),
        onError: () => toast.error("Thêm vào wishlist thất bại!")
      }
    );
  };

  if (!product) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-gray-500 font-medium">Loading product details...</p>
      </div>
    );
  }

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
            <li className="text-indigo-600 font-bold">{detailProduct.brand}</li>
            <li><ChevronRightIcon sx={{ fontSize: 16 }} className="text-gray-400" /></li>
            <li className="text-gray-900 font-bold truncate max-w-[200px] sm:max-w-none">{detailProduct.title}</li>
          </ol>
        </nav>

        {/* Main Product Grid (2 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 pb-16">

          {/* Left Column: Images */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            {/* Large Image */}
            <div className="w-full h-[450px] sm:h-[580px] lg:h-[620px] rounded-xl overflow-hidden bg-gray-50 shadow-xs border border-gray-100">
              {detailProduct.images.length > 0 ? (
                <img
                  src={detailProduct.images[selectImage]}
                  alt={detailProduct.title}
                  className="w-full h-full object-cover object-center transition-all duration-300 hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-gray-400">Sản phẩm chưa có ảnh</div>
              )}
            </div>

            {/* Thumbnail list */}
            <div className="flex flex-wrap gap-3 sm:gap-4">
              {detailProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectImage(idx)}
                  className={`relative h-20 w-24 sm:h-28 sm:w-36 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${selectImage === idx
                    ? "border-indigo-600 ring-2 ring-indigo-600/20"
                    : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx}`}
                    className="w-full h-full object-cover object-center"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Information & Actions */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="space-y-6">

              {/* Brand and Title */}
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-indigo-600">
                  {detailProduct.brand}
                </p>
                <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  {detailProduct.title}
                </h1>
              </div>

              {/* Rating and Reviews Count */}
              <div className="flex items-center space-x-3">
                <Rating
                  name="read-only"
                  value={
                    reviewsList.length > 0
                      ? Number(
                        (
                          reviewsList.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) /
                          reviewsList.length
                        ).toFixed(1)
                      )
                      : 0
                  }
                  precision={0.1}
                  readOnly
                  size="small"
                  sx={{ color: reviewsList.length > 0 ? "#6366f1" : "#cbd5e1" }}
                />
                <span className="text-xs text-gray-500 font-medium">
                  {reviewsList.length > 0
                    ? `${(
                      reviewsList.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) /
                      reviewsList.length
                    ).toFixed(1)} (${reviewsList.length} customer reviews)`
                    : "Chưa có đánh giá"}
                </span>
              </div>

              {/* Price Section */}
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-black text-gray-900">
                  {formatVnd(detailProduct.discountedPrice)}
                </span>
                {detailProduct.discountPersent > 0 && (
                  <>
                    <span className="text-lg text-gray-400 line-through font-medium">
                      {formatVnd(detailProduct.price)}
                    </span>
                    <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                      -{detailProduct.discountPersent}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Product Short Description */}
              <p className="text-sm text-gray-600 leading-relaxed">
                {detailProduct.description}
              </p>

              <hr className="border-gray-100" />

              {/* Color Options */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">
                  Color: <span className="text-gray-500 font-medium capitalize">{selectedColor || detailProduct.colors[0]?.name}</span>
                </h3>
                <div className="flex space-x-3">
                  {detailProduct.colors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color.name)}
                      className={`h-8 w-8 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center ${selectedColor === color.name || (!selectedColor && color.id === detailProduct.colors[0]?.id)
                        ? "border-indigo-600 ring-2 ring-indigo-600/30 scale-110"
                        : "border-gray-200 hover:scale-105"
                        }`}
                      title={color.name}
                    >
                      <span className={`h-6 w-6 rounded-full ${color.bg || "bg-gray-800"}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                    Select Size
                  </h3>
                  <a href="#size-guide" className="text-xs font-semibold text-indigo-600 hover:underline">
                    Size Guide
                  </a>
                </div>
                <div className="grid grid-cols-4 gap-2.5">
                  {detailProduct.sizes.map((size) => {
                    const isSelected = (selectedSize || detailProduct.sizes[0]?.name) === size.name;
                    return (
                      <button
                        key={size.name}
                        disabled={!size.inStock}
                        onClick={() => {
                          setSelectedSize(size.name);
                          setQuantity(1);
                        }}
                        className={`py-3 text-xs font-bold rounded-lg border transition-all cursor-pointer ${!size.inStock
                          ? "bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed line-through"
                          : isSelected
                            ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                            : "bg-white border-gray-200 text-gray-800 hover:border-gray-400"
                          }`}
                      >
                        {size.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Selector & Real-Time Stock Status */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                    Quantity
                  </h3>
                  <span className={`text-xs font-bold ${maxStockForSelectedSize <= 0 ? 'text-red-500' : maxStockForSelectedSize < 5 ? 'text-amber-500' : 'text-emerald-600'}`}>
                    {maxStockForSelectedSize <= 0
                      ? "Out of stock"
                      : `In stock: ${maxStockForSelectedSize} left`}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center border border-gray-200 rounded-lg p-1">
                    <button
                      onClick={handleDecreaseQuantity}
                      disabled={quantity <= 1}
                      className="p-1.5 text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <RemoveIcon sx={{ fontSize: 16 }} />
                    </button>
                    <span className="w-12 text-center text-xs font-bold text-gray-900">
                      {quantity}
                    </span>
                    <button
                      onClick={handleIncreaseQuantity}
                      disabled={quantity >= maxStockForSelectedSize}
                      className="p-1.5 text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <AddIcon sx={{ fontSize: 16 }} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Call to Actions (Add To Cart & Wishlist) */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={maxStockForSelectedSize <= 0 || isAddingCart}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white py-3.5 px-6 rounded-xl font-bold text-xs shadow-md shadow-indigo-500/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAddingCart ? "ADDING..." : maxStockForSelectedSize <= 0 ? "OUT OF STOCK" : "ADD TO CART"}
                </button>
                <button
                  type="button"
                  onClick={handleSaveToWishlist}
                  className="p-3.5 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl text-gray-600 transition-all flex items-center justify-center cursor-pointer"
                  title="Add to Wishlist"
                >
                  <FavoriteBorderIcon sx={{ fontSize: 20 }} />
                </button>
              </div>

              {/* Value proposition bullet points */}
              <div className="bg-gray-50/70 rounded-xl p-4 space-y-2 border border-gray-100/60">
                {detailProduct.bullets.map((bullet, idx) => (
                  <div key={idx} className="flex items-center text-xs text-gray-600 space-x-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* Store Information */}
        <StoreInformation
          storeData={store}
          storeProductsCount={storeProducts.length + (product ? 1 : 0)}
        />

        {/* Products from the Same Store */}
        {store && storeProducts.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
                  <p className="text-xs font-extrabold uppercase tracking-widest text-indigo-600">
                    From The Same Store
                  </p>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight mt-1">
                  More Products from {store.name}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Explore other premium items sold by {store.owner || store.name}
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate(`/store/${store.id}`)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition-all cursor-pointer"
              >
                <span>View All Shop Products ({storeProducts.length + 1})</span>
                <ChevronRightIcon sx={{ fontSize: 16 }} />
              </button>
            </div>
            <HomeSectionCarousel data={storeProducts} />
          </div>
        )}

        {/* Reviews Section */}
        <RateAndReview product={product} productId={productId || product?.id} />

        {/* Relevant Products Slider Carousel */}
        <div className="mt-16 pt-12 border-t border-gray-100">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Similar Products You May Like
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Explore handpicked items curated just for you
            </p>
          </div>
          <HomeSectionCarousel data={productRelevant} />
        </div>

      </div>
    </div>
  );
}
