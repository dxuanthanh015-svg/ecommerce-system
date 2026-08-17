import React from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { PlusIcon, MinusIcon } from "@heroicons/react/20/solid";
import { filters, singleFilter } from "./filterData";

export default function ProductMobileFilterDialog({ open, onClose, filterState = {}, onFilterChange, onClearFilters }) {
  const hasActiveFilters =
    filterState.color?.length > 0 ||
    filterState.size?.length > 0 ||
    filterState.price ||
    filterState.discount ||
    filterState.stock;

  const allSections = [
    ...filters.map(s => ({ ...s, type: "checkbox" })),
    ...singleFilter.map(s => ({ ...s, type: "radio" })),
  ];

  return (
    <Dialog open={open} onClose={onClose} className="relative z-40 lg:hidden">
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
            <div className="flex items-center gap-3">
              {hasActiveFilters && (
                <button
                  onClick={onClearFilters}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
                >
                  Clear all
                </button>
              )}
              <button
                type="button"
                onClick={() => onClose(false)}
                className="relative -mr-2 flex size-10 items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>
          </div>

          <form className="mt-4 border-t border-gray-200">
            {allSections.map((section) => (
              <Disclosure
                key={section.id + section.name}
                as="div"
                className="border-t border-gray-200 px-4 py-6"
              >
                <h3 className="-mx-2 -my-3 flow-root">
                  <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                    <span className="font-medium text-gray-900">{section.name}</span>
                    <span className="ml-6 flex items-center">
                      <PlusIcon aria-hidden="true" className="size-5 group-data-open:hidden" />
                      <MinusIcon aria-hidden="true" className="size-5 group-not-data-open:hidden" />
                    </span>
                  </DisclosureButton>
                </h3>
                <DisclosurePanel className="pt-6">
                  <div className="space-y-4">
                    {section.options.map((option, optionIdx) => {
                      if (section.type === "checkbox") {
                        const isChecked = (filterState[section.id] || []).includes(option.value);
                        return (
                          <div key={option.value} className="flex gap-3 items-center">
                            <input
                              value={option.value}
                              checked={isChecked}
                              onChange={(e) => onFilterChange(section.id, option.value, e.target.checked)}
                              id={`filter-mobile-${section.id}-${optionIdx}`}
                              name={`${section.id}[]`}
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            />
                            <label htmlFor={`filter-mobile-${section.id}-${optionIdx}`} className="text-sm text-gray-600">
                              {option.label}
                            </label>
                          </div>
                        );
                      }
                      // Radio
                      return (
                        <div key={option.value} className="flex gap-3 items-center">
                          <input
                            value={option.value}
                            checked={filterState[section.id] === option.value}
                            onChange={() => onFilterChange(section.id, option.value, true)}
                            onClick={() => {
                              if (filterState[section.id] === option.value)
                                onFilterChange(section.id, null, true);
                            }}
                            id={`filter-mobile-radio-${section.id}-${optionIdx}`}
                            name={`${section.id}-mobile-radio`}
                            type="radio"
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                          <label htmlFor={`filter-mobile-radio-${section.id}-${optionIdx}`} className="text-sm text-gray-600">
                            {option.label}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </DisclosurePanel>
              </Disclosure>
            ))}
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
