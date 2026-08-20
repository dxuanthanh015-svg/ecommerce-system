import { Fragment, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  XMarkIcon,

} from "@heroicons/react/24/outline";
import { navigation } from "./navigation";
import { useNavigate } from "react-router-dom";
import { Avatar, Menu, MenuItem } from "@mui/material";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { getUserCart } from "../../utils/cartUtils";
import { useEffect } from "react";

export default function Navigation() {
  const user = JSON.parse(localStorage.getItem('user'));
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' && !!user;
  const [cartCount, setCartCount] = useState(() => getUserCart().length);
  const wishlistItems = JSON.parse(localStorage.getItem('wishlist')) || [];

  useEffect(() => {
    const handleCartUpdate = () => {
      setCartCount(getUserCart().length);
    };
    window.addEventListener("cartUpdated", handleCartUpdate);
    window.addEventListener("storage", handleCartUpdate);
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
      window.removeEventListener("storage", handleCartUpdate);
    };
  }, []);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const openUserMenu = Boolean(anchorEl);
  const handleCategoryClick = (category, section, item, close) => {
    if (item?.href && item.href !== '#') {
      navigate(item.href);
    } else if (category && section && item) {
      navigate(`/${category.id}/${section.id}/${item.id}`);
    } else if (category && section) {
      navigate(`/${category.id}/${section.id}`);
    } else if (category) {
      navigate(`/${category.id}`);
    }
    if (close) close();
  };
  const handleCloseUserMenu = (event) => {
    setAnchorEl(null);
  };

  const handleUserClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleOpen = () => {

  };
  return (
    <div className="bg-white z-50">
      {/* Mobile menu */}
      <Dialog open={open} onClose={setOpen} className="relative z-40 lg:hidden">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
        />
        <div className="fixed inset-0 z-40 flex">
          <DialogPanel
            transition
            className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-12 shadow-xl transition duration-300 ease-in-out data-closed:-translate-x-full"
          >
            <div className="flex px-4 pt-5 pb-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>

            {/* Links */}
            <TabGroup className="mt-2">
              <div className="border-b border-gray-200">
                <TabList className="-mb-px flex space-x-8 px-4">
                  {navigation.categories.map((category) => (
                    <Tab
                      key={category.name}
                      className="flex-1 border-b-2 border-transparent px-1 py-4 text-base font-medium whitespace-nowrap text-gray-900 data-selected:border-indigo-600 data-selected:text-indigo-600"
                    >
                      {category.name}
                    </Tab>
                  ))}
                </TabList>
              </div>
              <TabPanels as={Fragment}>
                {navigation.categories.map((category) => (
                  <TabPanel
                    key={category.name}
                    className="space-y-10 px-4 pt-10 pb-8"
                  >
                    <div className="grid grid-cols-2 gap-x-4">
                      {category.featured.map((item) => (
                        <div key={item.name} className="group relative text-sm">
                          <img
                            alt={item.imageAlt}
                            src={item.imageSrc}
                            className="aspect-square w-full rounded-lg bg-gray-100 object-cover group-hover:opacity-75"
                          />
                          <a
                            href={item.href}
                            className="mt-6 block font-medium text-gray-900"
                          >
                            <span
                              aria-hidden="true"
                              className="absolute inset-0 z-10"
                            />
                            {item.name}
                          </a>
                          <p aria-hidden="true" className="mt-1">
                            Shop now
                          </p>
                        </div>
                      ))}
                    </div>
                    {category.sections.map((section) => (
                      <div key={section.name}>
                        <p
                          onClick={() => {
                            navigate(`/${category.id}/${section.id}`);
                            setOpen(false);
                          }}
                          id={`${category.id}-${section.id}-heading-mobile`}
                          className="font-bold text-gray-900 hover:text-indigo-600 cursor-pointer transition-colors"
                        >
                          {section.name}
                        </p>
                        <ul
                          role="list"
                          aria-labelledby={`${category.id}-${section.id}-heading-mobile`}
                          className="mt-6 flex flex-col space-y-6"
                        >
                          {section.items.map((item) => (
                            <li key={item.name} className="flow-root">
                              <a
                                href={item.href}
                                onClick={(e) => {
                                  e.preventDefault();
                                  navigate(item.href);
                                  setOpen(false);
                                }}
                                className="-m-2 block p-2 text-gray-500 cursor-pointer hover:text-indigo-600 transition-colors"
                              >
                                {item.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </TabPanel>
                ))}
              </TabPanels>
            </TabGroup>

            <div className="space-y-6 border-t border-gray-200 px-4 py-6">
              {navigation.pages.map((page) => (
                <div key={page.name} className="flow-root">
                  <a
                    href={page.href}
                    className="-m-2 block p-2 font-medium text-gray-900"
                  >
                    {page.name}
                  </a>
                </div>
              ))}
            </div>

            <div className="space-y-6 border-t border-gray-200 px-4 py-6">
              <div className="flow-root">
                <a
                  href="#"
                  className="-m-2 block p-2 font-medium text-gray-900"
                >
                  Sign in
                </a>
              </div>
              <div className="flow-root">
                <a
                  href="#"
                  className="-m-2 block p-2 font-medium text-gray-900"
                >
                  Create account
                </a>
              </div>
            </div>

            <div className="border-t border-gray-200 px-4 py-6">
              <a href="#" className="-m-2 flex items-center p-2">
                <img
                  alt=""
                  src="https://tailwindcss.com/plus-assets/img/flags/flag-canada.svg"
                  className="block h-auto w-5 shrink-0"
                />
                <span className="ml-3 block text-base font-medium text-gray-900">
                  CAD
                </span>
                <span className="sr-only">change currency</span>
              </a>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <header className="relative bg-white">
        <p className="flex h-10 items-center justify-center bg-indigo-600 px-4 text-sm font-medium text-white sm:px-6 lg:px-8">
          Get free delivery on orders over $50
        </p>

        <nav
          aria-label="Top"
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        >
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open menu</span>
                <Bars3Icon aria-hidden="true" className="size-6" />
              </button>

              {/* Logo */}
              <div className="ml-4 flex lg:ml-0">
                <a href="#">
                  <span className="sr-only">Ecommerce-system</span>
                  <img alt="" src=".\nexCart.svg" className="h-12 w-auto" onClick={() => navigate('/')} />
                </a>
              </div>

              {/* Flyout menus */}
              <PopoverGroup className="hidden lg:ml-8 lg:block lg:self-stretch">
                <div className="flex h-full space-x-8">
                  {navigation.categories.map((category) => (
                    <Popover key={category.name} className="flex">
                      <div className="relative flex">
                        <PopoverButton
                          onClick={() => navigate(`/${category.id}`)}
                          className="group relative flex items-center justify-center text-sm font-medium text-gray-700 transition-colors duration-200 ease-out hover:text-indigo-600 data-open:text-indigo-600 cursor-pointer"
                        >
                          {category.name}
                          <span
                            aria-hidden="true"
                            className="absolute inset-x-0 -bottom-px z-30 h-0.5 transition duration-200 ease-out group-data-open:bg-indigo-600"
                          />
                        </PopoverButton>
                      </div>
                      <PopoverPanel
                        transition
                        className="absolute inset-x-0 top-full z-20 w-full bg-white text-sm text-gray-500 transition data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
                      >
                        {({ close }) => (
                          <>
                            {/* Presentational element used to render the bottom shadow */}
                            <div
                              aria-hidden="true"
                              className="absolute inset-0 top-1/2 bg-white shadow-sm"
                            />
                            <div className="relative bg-white">
                              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                                <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-16">
                                  <div className="col-start-2 grid grid-cols-2 gap-x-8">
                                    {category.featured.map((item) => (
                                      <div
                                        key={item.name}
                                        className="group relative text-base sm:text-sm"
                                      >
                                        <img
                                          alt={item.imageAlt}
                                          src={item.imageSrc}
                                          className="aspect-square w-full rounded-lg bg-gray-100 object-cover group-hover:opacity-75"
                                        />
                                        <a
                                          href={item.href}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            if (item.href) navigate(item.href);
                                            close();
                                          }}
                                          className="mt-6 block font-medium text-gray-900 cursor-pointer"
                                        >
                                          <span
                                            aria-hidden="true"
                                            className="absolute inset-0 z-10"
                                          />
                                          {item.name}
                                        </a>
                                        <p aria-hidden="true" className="mt-1">
                                          Shop now
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="row-start-1 grid grid-cols-3 gap-x-8 gap-y-10 text-sm">
                                    {category.sections.map((section) => (
                                      <div key={section.name}>
                                        <p
                                          onClick={() => {
                                            navigate(`/${category.id}/${section.id}`);
                                            close();
                                          }}
                                          id={`${section.name}-heading`}
                                          className="font-bold text-gray-900 hover:text-indigo-600 cursor-pointer transition-colors"
                                        >
                                          {section.name}
                                        </p>
                                        <ul
                                          role="list"
                                          aria-labelledby={`${section.name}-heading`}
                                          className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                        >
                                          {section.items.map((item) => (
                                            <li key={item.name} className="flex">
                                              <p
                                                onClick={() =>
                                                  handleCategoryClick(
                                                    category,
                                                    section,
                                                    item,
                                                    close,
                                                  )
                                                }
                                                className="hover:text-indigo-600 cursor-pointer transition-colors"
                                              >
                                                {item.name}
                                              </p>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </PopoverPanel>
                    </Popover>
                  ))}
                  {navigation.pages.map((page) => (
                    <a
                      key={page.name}
                      href={page.href}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(page.href);
                      }}
                      className="flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600 cursor-pointer transition-colors"
                    >
                      {page.name}
                    </a>
                  ))}
                </div>
              </PopoverGroup>

              <div className="ml-auto flex items-center">
                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                  {isLoggedIn ? (
                    <div>
                      <div
                        onClick={handleUserClick}
                        className="flex items-center gap-1.5 cursor-pointer group p-1.5 rounded-full hover:bg-gray-100/80 transition-all duration-200"
                      >
                        <Avatar
                          src={user?.avatarUrl}
                          sx={{
                            width: 38,
                            height: 38,
                            bgcolor: '#4f46e5',
                            color: "white",
                            fontWeight: 'bold',
                            fontSize: '13px',
                            boxShadow: '0 2px 8px rgba(79, 70, 229, 0.25)',
                            border: '2px solid white',
                          }}
                        >
                          {user?.firstName && user?.lastName
                            ? (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase()
                            : (user?.firstName?.charAt(0) || "P").toUpperCase()}
                        </Avatar>
                        <KeyboardArrowDownIcon
                          className={`text-gray-400 transition-transform duration-300 ${openUserMenu ? "rotate-180 text-indigo-600" : "group-hover:text-gray-700"}`}
                          sx={{ fontSize: 18 }}
                        />
                      </div>

                      <Menu
                        id="user-menu"
                        anchorEl={anchorEl}
                        open={openUserMenu}
                        onClose={handleCloseUserMenu}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        SlotProps={{
                          paper: {
                            elevation: 0,
                            sx: {
                              overflow: 'visible',
                              filter: 'drop-shadow(0px 10px 30px rgba(0, 0, 0, 0.12))',
                              mt: 1.5,
                              borderRadius: '20px',
                              padding: '8px',
                              minWidth: 230,
                              border: '1px solid rgba(243, 244, 246, 1)',
                              '& .MuiMenuItem-root': {
                                borderRadius: '12px',
                                padding: '10px 14px',
                                fontSize: '13px',
                                fontWeight: 600,
                                color: '#374151',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  backgroundColor: '#f4f6ff',
                                  color: '#4f46e5',
                                },
                              },
                            },
                          },
                        }}
                      >
                        {/* Menu User Header Card */}
                        <div className="px-3.5 py-3 mb-2 bg-[#f8f9fc] rounded-2xl border border-gray-100 flex items-center gap-3">
                          <Avatar
                            src={user?.avatarUrl}
                            sx={{ width: 34, height: 34, bgcolor: '#4f46e5', fontSize: '12px', fontWeight: 'bold' }}
                          >
                            {user?.firstName && user?.lastName
                              ? (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase()
                              : (user?.firstName?.charAt(0) || "P").toUpperCase()}
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-extrabold text-gray-900 truncate">
                              {user?.firstName || "Premium"} {user?.lastName || "Member"}
                            </p>
                            <p className="text-[11px] text-gray-500 truncate">
                              {user?.email || "nexcart.user@example.com"}
                            </p>
                          </div>
                        </div>

                        <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/account/setting'); }} className="gap-3">
                          <PersonOutlinedIcon sx={{ fontSize: 18, color: '#4f46e5' }} />
                          <span>My Profile</span>
                        </MenuItem>

                        <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/account/order'); }} className="gap-3">
                          <Inventory2OutlinedIcon sx={{ fontSize: 18, color: '#6366f1' }} />
                          <span>My Orders</span>
                        </MenuItem>

                        <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/account/setting'); }} className="gap-3">
                          <SettingsOutlinedIcon sx={{ fontSize: 18, color: '#64748b' }} />
                          <span>Settings</span>
                        </MenuItem>

                        <div className="my-1.5 border-t border-gray-100" />

                        <MenuItem
                          onClick={() => {
                            handleCloseUserMenu();
                            localStorage.setItem("isLoggedIn", "false");
                            localStorage.removeItem("user");
                            localStorage.removeItem("currentStore");
                            localStorage.removeItem("currentProducts")
                            navigate('/login');
                          }}
                          className="gap-3 hover:!bg-red-50"
                        >
                          <LogoutOutlinedIcon sx={{ fontSize: 18, color: '#ef4444' }} />
                          <span className="text-red-500 font-bold">Log Out</span>
                        </MenuItem>
                      </Menu>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => navigate('/login')}
                        className="text-xs font-bold text-gray-700 hover:text-indigo-600 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
                      >
                        Sign In
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate('/signup')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-sm shadow-indigo-500/20"
                      >
                        Sign Up
                      </button>
                    </div>
                  )}
                </div>




                {/* Wishlist */}
                <div className="ml-4 flow-root lg:ml-6">
                  <button
                    type="button"
                    onClick={() => navigate('/wishlist')}
                    className="group -m-2 flex items-center p-2 cursor-pointer border-none bg-transparent"
                    title="View Wishlist"
                  >
                    <FavoriteBorderIcon
                      aria-hidden="true"
                      className="text-gray-400 group-hover:text-rose-500 transition-colors"
                      sx={{ fontSize: 22 }}
                    />
                    <span className="ml-1.5 text-xs font-bold text-gray-700 group-hover:text-rose-600">
                      {wishlistItems.length}
                    </span>
                  </button>
                </div>

                {/* Cart */}
                <div className="ml-4 flow-root lg:ml-6">
                  <button
                    type="button"
                    onClick={() => navigate('/cart')}
                    className="group -m-2 flex items-center p-2 cursor-pointer border-none bg-transparent"
                    title="View Cart"
                  >
                    <ShoppingBagIcon
                      aria-hidden="true"
                      className="size-6 shrink-0 text-gray-400 group-hover:text-indigo-600 transition-colors"
                    />
                    <span className="ml-1.5 text-xs font-bold text-gray-700 group-hover:text-indigo-600">
                      {cartCount}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}
