import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import ProductCard from "./ProductCard";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';

export default function ProductGrid({ productsList, filterState = {}, sortOption = "featured", searchQuery="", isLoading = false, isError = false, onRetry }) {
  const [page, setPage] = useState(1);
  const { topLavelCategory, secondLavelCategory, thirdLavelCategory } = useParams();
  const location = useLocation();

  const flashSaleLocation = location.pathname.toLowerCase().includes('flashsale');
  const trendingLocation = location.pathname.toLowerCase().includes('trending');

  const normalizeCategory = (value) => String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");

  const matchesCategory = (product, routeValue, level) => {
    if (!routeValue) return true;

    const category = product.category || {};
    const route = normalizeCategory(routeValue);
    const aliases = {
      casualshoes: ["casualshoes", "unisexcasualshoes", "casualsneakers"],
      heel: ["heel", "heels", "highheels"],
      heels: ["heels", "heel", "highheels"],
    };
    const accepted = new Set([route, ...(aliases[route] || [])]);
    const candidates = level === "third"
      ? [product.thirdLavelCategory, category.slug, category.name, category.id]
      : level === "second"
        ? [product.secondLavelCategory, category.parent?.slug, category.parent?.name, category.parentCategory?.slug, category.parentCategory?.name]
        : [product.topLavelCategory, category.parent?.parent?.slug, category.parent?.parent?.name];
    const normalizedCandidates = candidates.map(normalizeCategory).filter(Boolean);

    // Most API products only contain a leaf category. In that case the URL's
    // third segment is the reliable filter; don't reject products because the
    // API does not include their parent hierarchy.
    if (level !== "third" && normalizedCandidates.length === 0) return true;
    return normalizedCandidates.some((candidate) => accepted.has(candidate));
  };

  
  const categoryFiltered = productsList.filter(item => {
    const visibleMatch = item.isVisible !== false && item.isActive !== false;
    const flashSaleMatch = flashSaleLocation ? item.isFlashSale === true : true;
    const trendingMatch = trendingLocation ? item.isTrending === true : true;
    const searchQueryLower = searchQuery ? item.title?.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    const matchTop = matchesCategory(item, topLavelCategory, "top");
    const matchSecond = matchesCategory(item, secondLavelCategory, "second");
    const matchThird = matchesCategory(item, thirdLavelCategory, "third");
    return visibleMatch && matchTop && matchSecond && matchThird && searchQueryLower && flashSaleMatch && trendingMatch;
  });




  const sidebarFiltered = categoryFiltered.filter(item => {
    if (filterState.color?.length > 0) {
      const productColor = item.color?.toLowerCase() ?? "";
      const match = filterState.color.some(c => productColor.includes(c.toLowerCase()));
      if (!match) return false;
    }

    if (filterState.size?.length > 0) {
      const productSizes = (item.size || []).map(s => s.name?.toLowerCase());
      const match = filterState.size.some(s => productSizes.includes(s.toLowerCase()));
      if (!match) return false;
    }

    if (filterState.price) {
      const [minStr, maxStr] = filterState.price.split("-");
      const min = Number(minStr);
      const max = Number(maxStr);
      const effectivePrice = item.discountedPrice ?? item.price;
      if (effectivePrice < min || effectivePrice > max) return false;
    }

    if (filterState.discount) {
      const minDiscount = Number(filterState.discount);
      if ((item.discountPersent ?? 0) < minDiscount) return false;
    }

    if (filterState.stock) {
      if (filterState.stock === "in_stock" && (item.quantity ?? 0) <= 0) return false;
      if (filterState.stock === "out_of_stock" && (item.quantity ?? 0) > 0) return false;
    }

    return true;
  });

  const sorted = [...sidebarFiltered].sort((a, b) => {
    const priceA = a.discountedPrice ?? a.price;
    const priceB = b.discountedPrice ?? b.price;
    if (sortOption === "price_asc") return priceA - priceB;
    if (sortOption === "price_desc") return priceB - priceA;
    if (sortOption === "newest") return (b.id ?? "").localeCompare(a.id ?? "");
    return 0;
  });

  useEffect(() => { setPage(1); }, [topLavelCategory, secondLavelCategory, thirdLavelCategory, filterState, sortOption]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const itemPerPage = 12;
  const totalPages = Math.ceil(sorted.length / itemPerPage);
  const startIndex = (page - 1) * itemPerPage;
  const currentItems = sorted.slice(startIndex, startIndex + itemPerPage);

  const handleChangePage = (event, newPage) => { setPage(newPage); };

  if (isLoading || isError || sorted.length === 0) {
    return (
      <div className="lg:col-span-3 flex flex-col items-center justify-center py-32 text-center">
        {isLoading ? (
          <>
            <p className="text-lg font-semibold text-gray-700">Loading products…</p>
            <p className="mt-1 text-sm text-gray-400">Fetching the catalog from the server.</p>
          </>
        ) : isError ? (
          <>
            <p className="text-4xl mb-4">⚠️</p>
            <h3 className="text-lg font-semibold text-gray-700">Could not load products</h3>
            <p className="mt-1 text-sm text-gray-500">Check the backend connection, then try again.</p>
            <button type="button" onClick={onRetry} className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
              Try again
            </button>
          </>
        ) : (
          <>
            <p className="text-4xl mb-4">🔍</p>
            <h3 className="text-lg font-semibold text-gray-700">No products found</h3>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or browse another category.</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="lg:col-span-3">
      <p className="text-xs text-gray-400 mb-4">{sorted.length} product{sorted.length !== 1 ? "s" : ""} found</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
        {currentItems.map((product, index) => (
          <ProductCard key={product.id || index} product={product} />
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 mt-14 pt-8 border-t border-gray-100">
        {totalPages > 1 && (
          <Pagination
            count={totalPages}
            page={page}
            onChange={handleChangePage}
            renderItem={(item) => (
              <PaginationItem
                slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                {...item}
              />
            )}
          />
        )}
      </div>
    </div>
  );
}
