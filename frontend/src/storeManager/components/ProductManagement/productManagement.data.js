export const PRODUCT_PAGE_SIZE = 10;

export const PRODUCT_STATUS_OPTIONS = [
  "All Statuses",
  "In Stock",
  "Low Stock",
  "Out of Stock",
];

export const createDefaultProductFormState = () => ({
  id: "",
  id_store: "",
  imageUrl: "",
  images: [],
  brand: "",
  color: "Default",
  description: "",
  price: "",
  discountedPrice: "",
  discountPersent: 0,
  topLavelCategory: "Men",
  secondLavelCategory: "Clothing",
  thirdLavelCategory: "jackets_coats",
  fourthLavelCategory: "jackets_coats",
  isFlashSale: false,
  isTrending: false,
  stockLeft: 5,
  claimedPercent: 0,
  flashSaleEndTime: null, // Strictly null if isFlashSale is false
  size: [
    { name: "S", quantity: 5 },
    { name: "M", quantity: 10 },
    { name: "L", quantity: 5 },
  ],
  quantity: 20,
});

