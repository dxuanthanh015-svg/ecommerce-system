import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
} from "@heroicons/react/20/solid";
import ProductCard from "./ProductCard";
import { filters, singleFilter } from "./filterData";

const sortOptions = [
  { name: "Price: Low to High", href: "#", current: false },
  { name: "Price: High to Low", href: "#", current: false },
  { name: "Featured", href: "#", current: true },
  { name: "Newest", href: "#", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Product({ data }) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const productsList = data && data.length > 0 ? data : [];

  return (
    <div className="bg-white min-h-screen">
      {/* 1. Header Hero Banner */}
      <div className="bg-gradient-to-b from-indigo-50/70 via-blue-50/30 to-white py-14 px-4 sm:px-6 lg:px-8 text-center border-b border-gray-100">
        <span className="px-3.5 py-1 bg-indigo-100/80 text-indigo-600 text-[11px] font-bold rounded-full uppercase tracking-wider mb-3 inline-block">
          SUMMER COLLECTION
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-3">
          New Arrivals
        </h1>
        <p className="text-gray-500 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          Discover our latest collection of premium essentials, meticulously crafted for the modern wardrobe.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile filter dialog */}
        <Dialog
          open={mobileFiltersOpen}
          onClose={setMobileFiltersOpen}
          className="relative z-40 lg:hidden"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
          />

          <div className="fixed inset-0 z-40 flex">
            <DialogPanel
              transition
              className="relative ml-auto flex size-full max-w-xs transform flex-col overflow-y-auto bg-white pt-4 pb-6 shadow-xl transition duration-300 ease-in-out data-closed:translate-x-full"
            >
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-bold text-gray-900 uppercase">Filters</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="relative -mr-2 flex size-10 items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon aria-hidden="true" className="size-6" />
                </button>
              </div>

              {/* Filters */}
              <form className="mt-4 border-t border-gray-200">
                {filters.map((section) => (
                  <Disclosure
                    key={section.id}
                    as="div"
                    className="border-t border-gray-200 px-4 py-6"
                  >
                    <h3 className="-mx-2 -my-3 flow-root">
                      <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                        <span className="font-medium text-gray-900">
                          {section.name}
                        </span>
                        <span className="ml-6 flex items-center">
                          <PlusIcon
                            aria-hidden="true"
                            className="size-5 group-data-open:hidden"
                          />
                          <MinusIcon
                            aria-hidden="true"
                            className="size-5 group-not-data-open:hidden"
                          />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pt-6">
                      <div className="space-y-4">
                        {section.options.map((option, optionIdx) => (
                          <div key={option.value} className="flex gap-3 items-center">
                            <input
                              defaultValue={option.value}
                              id={`filter-mobile-${section.id}-${optionIdx}`}
                              name={`${section.id}[]`}
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label
                              htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                              className="text-sm text-gray-600"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                ))}
              </form>
            </DialogPanel>
          </div>
        </Dialog>

        {/* 2. Top Controls Bar */}
        <div className="flex items-center justify-end py-6 border-b border-gray-200 gap-4 my-2">
          <div className="flex items-center gap-3">
            <Menu as="div" className="relative inline-block text-left">
              <MenuButton className="group inline-flex items-center justify-center text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-200 rounded-lg px-3 py-1.5 bg-white shadow-xs">
                Sort by: Featured
                <ChevronDownIcon
                  aria-hidden="true"
                  className="-mr-1 ml-1 size-4 shrink-0 text-gray-400 group-hover:text-gray-500"
                />
              </MenuButton>

              <MenuItems
                transition
                className="absolute right-0 z-20 mt-2 w-48 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0"
              >
                <div className="py-1">
                  {sortOptions.map((option) => (
                    <MenuItem key={option.name}>
                      <a
                        href={option.href}
                        className={classNames(
                          option.current
                            ? "font-semibold text-indigo-600 bg-indigo-50/50"
                            : "text-gray-700",
                          "block px-4 py-2 text-xs sm:text-sm hover:bg-gray-50 transition-colors"
                        )}
                      >
                        {option.name}
                      </a>
                    </MenuItem>
                  ))}
                </div>
              </MenuItems>
            </Menu>

            <button
              type="button"
              className="p-1.5 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-lg bg-white"
            >
              <span className="sr-only">View grid</span>
              <Squares2X2Icon aria-hidden="true" className="size-4 sm:size-5" />
            </button>

            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="p-1.5 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-lg bg-white lg:hidden"
            >
              <span className="sr-only">Filters</span>
              <FunnelIcon aria-hidden="true" className="size-4 sm:size-5" />
            </button>
          </div>
        </div>

        {/* 3. Main Section: Sidebar Filters + Products Grid */}
        <section aria-labelledby="products-heading" className="pt-4 pb-20">
          <h2 id="products-heading" className="sr-only">
            Products
          </h2>

          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
            {/* Filter Sidebar */}
            <div className="hidden lg:block lg:col-span-1">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">
                Filters
              </h3>
              <form className="space-y-1">
                {filters.map((section) => (
                  <Disclosure
                    key={section.id}
                    as="div"
                    className="border-b border-gray-100 py-4"
                    defaultOpen={true}
                  >
                    <h3 className="-my-1 flow-root">
                      <DisclosureButton className="group flex w-full items-center justify-between bg-white py-2 text-xs sm:text-sm font-semibold text-gray-800 hover:text-indigo-600 transition-colors">
                        <span>{section.name}</span>
                        <span className="ml-4 flex items-center">
                          <PlusIcon
                            aria-hidden="true"
                            className="size-4 text-gray-400 group-data-open:hidden"
                          />
                          <MinusIcon
                            aria-hidden="true"
                            className="size-4 text-gray-400 group-not-data-open:hidden"
                          />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pt-3">
                      <div className="space-y-2.5">
                        {section.options.map((option, optionIdx) => (
                          <div key={option.value} className="flex items-center gap-2.5">
                            <input
                              defaultValue={option.value}
                              defaultChecked={option.checked}
                              id={`filter-${section.id}-${optionIdx}`}
                              name={`${section.id}[]`}
                              type="checkbox"
                              className="h-3.5 w-3.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            />
                            <label
                              htmlFor={`filter-${section.id}-${optionIdx}`}
                              className="text-xs text-gray-600 hover:text-gray-900 cursor-pointer select-none"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                ))}

                {singleFilter.map((section) => (
                  <Disclosure
                    key={section.id}
                    as="div"
                    className="border-b border-gray-100 py-4"
                    defaultOpen={true}
                  >
                    <h3 className="-my-1 flow-root">
                      <DisclosureButton className="group flex w-full items-center justify-between bg-white py-2 text-xs sm:text-sm font-semibold text-gray-800 hover:text-indigo-600 transition-colors">
                        <span>{section.name}</span>
                        <span className="ml-4 flex items-center">
                          <PlusIcon
                            aria-hidden="true"
                            className="size-4 text-gray-400 group-data-open:hidden"
                          />
                          <MinusIcon
                            aria-hidden="true"
                            className="size-4 text-gray-400 group-not-data-open:hidden"
                          />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pt-3">
                      <div className="space-y-2">
                        <FormControl component="fieldset">
                          <RadioGroup
                            name={`${section.id}-radio-group`}
                            className="space-y-1"
                          >
                            {section.options.map((option) => (
                              <FormControlLabel
                                key={option.value}
                                value={option.value}
                                control={<Radio size="small" sx={{ color: '#d1d5db', '&.Mui-checked': { color: '#4f46e5' } }} />}
                                label={<span className="text-xs text-gray-600 font-normal">{option.label}</span>}
                                sx={{ margin: 0, '& .MuiFormControlLabel-label': { fontSize: '0.75rem' } }}
                              />
                            ))}
                          </RadioGroup>
                        </FormControl>
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                ))}
              </form>
            </div>

            {/* Product Grid (3 columns on desktop sidebar view) */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                {productsList.map((product, index) => (
                  <ProductCard
                    key={product.id || index}
                    product={product}
                  />
                ))}
              </div>

              {/* 4. Pagination Bar */}
              <div className="flex items-center justify-center gap-2 mt-14 pt-8 border-t border-gray-100">
                <button className="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 text-gray-500 hover:bg-gray-50 text-xs transition-colors">
                  &lt;
                </button>
                <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-600 text-white font-bold text-xs shadow-sm">
                  1
                </button>
                <button className="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs transition-colors">
                  2
                </button>
                <button className="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs transition-colors">
                  3
                </button>
                <span className="text-gray-400 text-xs px-1">...</span>
                <button className="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs transition-colors">
                  10
                </button>
                <button className="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 text-gray-500 hover:bg-gray-50 text-xs transition-colors">
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

