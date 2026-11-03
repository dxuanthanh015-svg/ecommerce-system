  import React from "react";
  import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
  import { ChevronDownIcon, FunnelIcon, Squares2X2Icon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";
  import SearchIcon from '@mui/icons-material/Search';
  import { styled, alpha } from '@mui/material/styles';
  import InputBase from '@mui/material/InputBase';
  import { useState } from "react";

  const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  }));

  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
  }));

  const sortOptions = [
    { name: "Featured", value: "featured" },
    { name: "Price: Low to High", value: "price_asc" },
    { name: "Price: High to Low", value: "price_desc" },
    { name: "Newest", value: "newest" },
  ];



  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  export default function ProductTopControls({ onOpenMobileFilters, sortOption, onSortChange, searchQuery, onSearchChange }) {
    const currentLabel = sortOptions.find(o => o.value === sortOption)?.name ?? "Featured";

    return (
      <div className="flex flex-wrap items-center justify-between py-4 sm:py-6 border-b border-gray-200 gap-3 sm:gap-4 my-2">
        {/* Search */}
        <Search sx={{ flex: '1 1 100%', minWidth: 0, margin: 0, '@media (min-width: 640px)': { flex: '1 1 auto', maxWidth: 520 } }}>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search Products"
            inputProps={{ 'aria-label': 'search' }}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </Search>
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <Menu as="div" className="relative inline-block text-left">
            <MenuButton className="group inline-flex max-w-[190px] items-center justify-center text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-200 rounded-lg px-2.5 sm:px-3 py-2 bg-white shadow-xs cursor-pointer">
              <span className="truncate">Sort: {currentLabel}</span>
              <ChevronDownIcon
                aria-hidden="true"
                className="-mr-1 ml-1 size-4 shrink-0 text-gray-400 group-hover:text-gray-500"
              />
            </MenuButton>

            <MenuItems
              transition
              className="absolute right-0 z-20 mt-2 w-52 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0"
            >
              <div className="py-1">
                {sortOptions.map((option) => (
                  <MenuItem key={option.value}>
                    <button
                      onClick={() => onSortChange(option.value)}
                      className={classNames(
                        option.value === sortOption
                          ? "font-semibold text-indigo-600 bg-indigo-50/50"
                          : "text-gray-700",
                        "block w-full text-left px-4 py-2 text-xs sm:text-sm hover:bg-gray-50 transition-colors cursor-pointer"
                      )}
                    >
                      {option.name}
                    </button>
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
            onClick={onOpenMobileFilters}
            className="p-1.5 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-lg bg-white lg:hidden"
          >
            <span className="sr-only">Filters</span>
            <FunnelIcon aria-hidden="true" className="size-4 sm:size-5" />
          </button>
        </div>
      </div>
    );
  } 
