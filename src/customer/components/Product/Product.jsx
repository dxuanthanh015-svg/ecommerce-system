import { useState } from "react";
import ProductHeader from "./ProductHeader";
import ProductTopControls from "./ProductTopControls";
import ProductMobileFilterDialog from "./ProductMobileFilterDialog";
import ProductFilterSidebar from "./ProductFilterSidebar";
import ProductGrid from "./ProductGrid";
import { product_mock_data } from "../../../Data/product_mock_data";

const defaultSearch = "";

const defaultFilterState = {
  color: [],
  size: [],
  price: null,
  discount: null,
  stock: null,
};

export default function Product({ data }) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filterState, setFilterState] = useState(defaultFilterState);
  const [sortOption, setSortOption] = useState("featured");
  const [searchQuery, setSearchQuery] = useState(defaultSearch);
  
  const savedProducts = JSON.parse(localStorage.getItem("products"));
  const productsList = (savedProducts && savedProducts.length > 0)
    ? savedProducts
    : (data && data.length > 0 ? data : product_mock_data);

  const handleFilterChange = (sectionId, value, checked) => {
    setFilterState((prev) => {
      if (sectionId === "color" || sectionId === "size") {
        const current = prev[sectionId] || [];
        return {
          ...prev,
          [sectionId]: checked
            ? [...current, value]
            : current.filter((v) => v !== value),
        };
      }
      return {
        ...prev,
        [sectionId]: prev[sectionId] === value ? null : value,
      };
    });
  };

  const handleClearFilters = () => setFilterState(defaultFilterState);

  const handleSearchQuery = (query) => {
    setSearchQuery(query);   
  };

  return (
    <div className="bg-white min-h-screen">
      <ProductHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductMobileFilterDialog
          open={mobileFiltersOpen}
          onClose={setMobileFiltersOpen}
          filterState={filterState}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        <ProductTopControls
          onOpenMobileFilters={() => setMobileFiltersOpen(true)}
          sortOption={sortOption}
          onSortChange={setSortOption}
          searchQuery={searchQuery}
          onSearchChange={handleSearchQuery}          
        />

        <section aria-labelledby="products-heading" className="pt-4 pb-20">
          <h2 id="products-heading" className="sr-only">
            Products
          </h2>

          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
            <ProductFilterSidebar
              filterState={filterState}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
            <ProductGrid
              productsList={productsList}
              filterState={filterState}
              sortOption={sortOption}
              searchQuery={searchQuery}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
