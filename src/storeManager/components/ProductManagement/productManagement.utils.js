import { PRODUCT_PAGE_SIZE } from "./productManagement.data";

const LOW_STOCK_THRESHOLD = 5;

export const getProductInventoryStatus = (stockCount) => {
  const normalizedStock = Number(stockCount);

  if (normalizedStock === 0) {
    return {
      key: "Out of Stock",
      label: "Out of Stock (0)",
      badgeClassName:
        "bg-gray-100 text-gray-500 text-xs font-bold px-3 py-1 rounded-xl inline-block",
    };
  }

  if (normalizedStock <= LOW_STOCK_THRESHOLD) {
    return {
      key: "Low Stock",
      label: `Low Stock (${normalizedStock})`,
      badgeClassName:
        "bg-rose-50 text-rose-600 text-xs font-bold px-3 py-1 rounded-xl inline-block",
    };
  }

  return {
    key: "In Stock",
    label: `In Stock (${normalizedStock})`,
    badgeClassName:
      "bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-xl inline-block",
  };
};

export const getProductCategories = (products = []) => {
  const categories = Array.from(
    new Set(products.map((product) => product.category).filter(Boolean)),
  );

  return ["All Categories", ...categories];
};

export const filterProducts = (
  products = [],
  { searchTerm = "", selectedCategory = "All Categories", selectedStatus = "All Statuses" } = {},
) => {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  return products.filter((product) => {
    const matchesSearch =
      !normalizedSearch ||
      product.title?.toLowerCase().includes(normalizedSearch) ||
      product.sku?.toLowerCase().includes(normalizedSearch);

    const matchesCategory =
      selectedCategory === "All Categories" || product.category === selectedCategory;

    const matchesStatus =
      selectedStatus === "All Statuses" ||
      getProductInventoryStatus(product.stockCount).key === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });
};

export const paginateProducts = (
  products = [],
  currentPage = 1,
  pageSize = PRODUCT_PAGE_SIZE,
) => {
  const safePageSize = Math.max(pageSize, 1);
  const totalPages = Math.max(1, Math.ceil(products.length / safePageSize));
  const normalizedPage = Math.min(Math.max(currentPage, 1), totalPages);
  const startIndex = (normalizedPage - 1) * safePageSize;
  const paginatedItems = products.slice(startIndex, startIndex + safePageSize);

  return {
    items: paginatedItems,
    totalPages,
    currentPage: normalizedPage,
    showingFrom: products.length === 0 ? 0 : startIndex + 1,
    showingTo: products.length === 0 ? 0 : startIndex + paginatedItems.length,
  };
};

export const buildPaginationItems = (currentPage, totalPages) => {
  if (totalPages <= 1) {
    return [1];
  }

  const candidatePages = Array.from(
    new Set([1, currentPage - 1, currentPage, currentPage + 1, totalPages]),
  )
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((left, right) => left - right);

  return candidatePages.reduce((items, page, index) => {
    const previousPage = candidatePages[index - 1];

    if (index > 0 && page - previousPage > 1) {
      items.push(`ellipsis-${previousPage}-${page}`);
    }

    items.push(page);
    return items;
  }, []);
};
