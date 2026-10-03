import React from "react";
import { Disclosure } from "@headlessui/react";
import { PlusIcon, MinusIcon } from "@heroicons/react/20/solid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { filters, singleFilter } from "./filterData";

export default function ProductFilterSidebar({ filterState = {}, onFilterChange, onClearFilters }) {
  const hasActiveFilters =
    filterState.color?.length > 0 ||
    filterState.size?.length > 0 ||
    filterState.price ||
    filterState.discount ||
    filterState.stock;

  return (
    <div className="hidden lg:block lg:col-span-1">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors cursor-pointer"
          >
            Clear all
          </button>
        )}
      </div>

      <form className="space-y-1">
        {/* Multi-select (Checkbox) */}
        {filters.map((section) => (
          <Disclosure
            key={section.id}
            as="div"
            className="border-b border-gray-100 py-4"
            defaultOpen={true}
          >
            <h3 className="-my-1 flow-root">
              <Disclosure.Button className="group flex w-full items-center justify-between bg-white py-2 text-xs sm:text-sm font-semibold text-gray-800 hover:text-indigo-600 transition-colors">
                <span>{section.name}</span>
                <span className="ml-4 flex items-center">
                  <PlusIcon aria-hidden="true" className="size-4 text-gray-400 group-data-open:hidden" />
                  <MinusIcon aria-hidden="true" className="size-4 text-gray-400 group-not-data-open:hidden" />
                </span>
              </Disclosure.Button>
            </h3>
            <Disclosure.Panel className="pt-3">
              <div className="space-y-2.5">
                {section.options.map((option, optionIdx) => {
                  const isChecked = (filterState[section.id] || []).includes(option.value);
                  return (
                    <div key={option.value} className="flex items-center gap-2.5">
                      <input
                        value={option.value}
                        checked={isChecked}
                        onChange={(e) => onFilterChange(section.id, option.value, e.target.checked)}
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
                  );
                })}
              </div>
            </Disclosure.Panel>
          </Disclosure>
        ))}

        {/* Single-select (Radio) */}
        {singleFilter.map((section) => (
          <Disclosure
            key={section.id}
            as="div"
            className="border-b border-gray-100 py-4"
            defaultOpen={true}
          >
            <h3 className="-my-1 flow-root">
              <Disclosure.Button className="group flex w-full items-center justify-between bg-white py-2 text-xs sm:text-sm font-semibold text-gray-800 hover:text-indigo-600 transition-colors">
                <span>{section.name}</span>
                <span className="ml-4 flex items-center">
                  <PlusIcon aria-hidden="true" className="size-4 text-gray-400 group-data-open:hidden" />
                  <MinusIcon aria-hidden="true" className="size-4 text-gray-400 group-not-data-open:hidden" />
                </span>
              </Disclosure.Button>
            </h3>
            <Disclosure.Panel className="pt-3">
              <div className="space-y-2">
                <FormControl component="fieldset">
                  <RadioGroup
                    name={`${section.id}-radio-group`}
                    value={filterState[section.id] ?? ""}
                    onChange={(e) => onFilterChange(section.id, e.target.value, true)}
                    className="space-y-1"
                  >
                    {section.options.map((option) => (
                      <FormControlLabel
                        key={option.value}
                        value={option.value}
                        control={
                          <Radio
                            size="small"
                            onClick={() => {
                              // Click same radio → deselect
                              if (filterState[section.id] === option.value) {
                                onFilterChange(section.id, null, true);
                              }
                            }}
                            sx={{
                              color: '#d1d5db',
                              '&.Mui-checked': { color: '#4f46e5' },
                            }}
                          />
                        }
                        label={
                          <span className="text-xs text-gray-600 font-normal">
                            {option.label}
                          </span>
                        }
                        sx={{ margin: 0, '& .MuiFormControlLabel-label': { fontSize: '0.75rem' } }}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </div>
            </Disclosure.Panel>
          </Disclosure>
        ))}
      </form>
    </div>
  );
}
