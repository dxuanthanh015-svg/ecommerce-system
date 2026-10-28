import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CircleIcon from "@mui/icons-material/Circle";
import FlashSaleCountdown from "./FlashSaleCountDown";
import { salePoster } from "./salePoster";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../../../../hooks/useProductQuery";
import { formatVnd } from "../../../../utils/currency";

export default function FlashSaleSection() {
  const navigate = useNavigate();
  const { data: allProducts = [], isLoading } = useProducts();
  // Backend chưa có field isFlashSale → dùng salePoster làm fallback
  const safeProducts = Array.isArray(allProducts) ? allProducts : [];
  const flashSaleItems = safeProducts.filter((p) => p.isFlashSale === true);
  const displayItems = flashSaleItems.length > 0 ? flashSaleItems : salePoster;

  return (
    <section className="py-12 bg-indigo-50 rounded-md">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-8 gap-6">
          <div className="text-center md:text-left">
            <div className="flex inline-flex items-center gap-2 mb-2 px-3 py-1 bg-indigo-50 rounded-full border border-red-100">
              <CircleIcon sx={{ fontSize: 10 }} className="text-indigo-700 " />
              <span className="text-xs font-semibold text-indigo-700 uppercase tracking-widest">
                Live Now
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Golden Hour Flash Sale
            </h2>
          </div>

          {/* Countdown Timer */}
          <div className="flex items-center gap-2 sm:gap-3">
            <FlashSaleCountdown />
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-[320px]/w-full sm:w-[1100px] mx-auto">
          {displayItems.slice(0, 9).map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/product/${item.id}`)}
              className="group flex flex-col justify-between space-y-7 cursor-pointer"
            >
              <div>
                {/* Image & Badge */}
                <div className="aspect-[3/4] rounded-md bg-gray-100 overflow-hidden mb-3 relative shadow-xs group-hover:shadow-md transition-all duration-300">
                  <span className="absolute top-3 left-3 z-10 bg-indigo-700 text-white px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm">
                    {item.discountPersent ? `${item.discountPersent}% OFF` : "-20%"}
                  </span>
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out cursor-pointer"
                    src={item.imageUrl}
                    alt={item.title || item.name}
                  />
                </div>

                {/* Info */}
                {item.brand && (
                  <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider mb-0.5">
                    {item.brand}
                  </p>
                )}
                <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-1 truncate group-hover:text-indigo-600 transition-colors">
                  {item.title || item.name}
                </h3>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-base sm:text-lg font-bold text-gray-900">
                    {formatVnd(item.discountedPrice || item.price || 0)}
                  </span>
                  {item.price && (
                    <span className="text-xs sm:text-sm text-gray-400 line-through">
                      {formatVnd(item.price)}
                    </span>
                  )}
                </div>
              </div>

              {/* Stock Progress */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between items-center text-[11px] font-medium text-gray-500">
                  <span className="text-indigo-700 font-semibold">
                    Only {item.stockLeft} left
                  </span>
                  <span>{item.claimedPercent}% Claimed</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-700 rounded-full transition-all duration-500"
                    style={{ width: `${item.claimedPercent}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Link */}
        <div className="mt-10 text-center">
          <a
            onClick={() => navigate('/flashsale')}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-wider cursor-pointer"
          >
            View All Flash Sales
            <ArrowForwardIcon sx={{ fontSize: 18 }} />
          </a>
        </div>
      </div>
    </section>
  );
}
