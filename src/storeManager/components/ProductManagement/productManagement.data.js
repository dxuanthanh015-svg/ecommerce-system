export const PRODUCT_PAGE_SIZE = 10;

export const PRODUCT_STATUS_OPTIONS = [
  "All Statuses",
  "In Stock",
  "Low Stock",
  "Out of Stock",
];

export const DEFAULT_PRODUCTS = [
  {
    id: 1,
    title: "Acoustic Pro NC",
    sku: "AP-NC-01",
    category: "Electronics",
    price: 299.0,
    stockCount: 45,
    isVisible: true,
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Ceramic Pour-Over",
    sku: "HM-PO-02",
    category: "Home Goods",
    price: 45.0,
    stockCount: 3,
    isVisible: true,
    imageUrl:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Organic Cotton Basics",
    sku: "AP-CB-03",
    category: "Apparel",
    price: 32.0,
    stockCount: 120,
    isVisible: false,
    imageUrl:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Leather Chelsea Boots",
    sku: "FW-CB-04",
    category: "Footwear",
    price: 220.0,
    stockCount: 18,
    isVisible: true,
    imageUrl:
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Minimalist Leather Watch",
    sku: "AC-WA-05",
    category: "Electronics",
    price: 180.0,
    stockCount: 2,
    isVisible: true,
    imageUrl:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200&auto=format&fit=crop",
  },
];

const defaultProductFormState = {
  title: "",
  brand: "",
  description: "",
  price: "",
  promoPrice: "",
  level1Category: "",
  level2Category: "",
  level3Category: "",
  tags: "",
  visibility: "Active",
  mediaImages: [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=300&auto=format&fit=crop",
      isMain: true,
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=300&auto=format&fit=crop",
      isMain: false,
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=300&auto=format&fit=crop",
      isMain: false,
    },
  ],
  variants: [
    {
      id: 1,
      optionName: "Size",
      values: ["S", "M", "L"],
    },
    {
      id: 2,
      optionName: "Color",
      values: ["Black", "White"],
    },
  ],
  generatedMatrix: [
    { id: 1, variant: "S / Black", price: 150.0, stock: 50, sku: "TSHIRT-S-BLK" },
    { id: 2, variant: "M / Black", price: 150.0, stock: 45, sku: "TSHIRT-M-BLK" },
    { id: 3, variant: "L / Black", price: 150.0, stock: 30, sku: "TSHIRT-L-BLK" },
  ],
};

export const createDefaultProductFormState = () => ({
  ...defaultProductFormState,
  mediaImages: defaultProductFormState.mediaImages.map((image) => ({ ...image })),
  variants: defaultProductFormState.variants.map((variant) => ({
    ...variant,
    values: [...variant.values],
  })),
  generatedMatrix: defaultProductFormState.generatedMatrix.map((row) => ({ ...row })),
});

export const MOCK_EDIT_PRODUCT_DATA = {
  title: "Acoustic Pro NC Headphones",
  brand: "NexCart Originals",
  description:
    "Premium noise cancelling headphones with rich bass and crystal clear audio quality.",
  price: "299.00",
  promoPrice: "249.00",
  level1Category: "Electronics",
  level2Category: "Audio",
  level3Category: "Headphones",
  tags: "Wireless, Noise Cancelling, Premium",
  visibility: "Active",
};
