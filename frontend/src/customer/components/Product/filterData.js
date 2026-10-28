export const color = [
  "White",
  "Black",
  "Red",
  "Beige",
  "Pink",
  "Green",
  "Yellow",
];

// Bộ lọc chọn nhiều (Multi-select Filters / Checkbox)
export const filters = [
  {
    id: "color",
    name: "Color",
    options: color.map((c) => ({
      value: c.toLowerCase(),
      label: c,
      checked: false,
    })),
  },
  {
    id: "size",
    name: "Size",
    options: [
      { value: "s", label: "S", checked: false },
      { value: "m", label: "M", checked: false },
      { value: "l", label: "L", checked: false },
    ],
  },
];

// Bộ lọc chọn 1 (Single-select Filters / Radio Box)
export const singleFilter = [
  {
    id: "price",
    name: "Price",
    options: [
      { value: "0-500000", label: "Dưới 500.000 VND" },
      { value: "500000-1000000", label: "500.000–1.000.000 VND" },
      { value: "1000000-2000000", label: "1.000.000–2.000.000 VND" },
      { value: "2000000-3000000", label: "2.000.000–3.000.000 VND" },
      { value: "3000000-5000000", label: "3.000.000–5.000.000 VND" },
    ],
  },
  {
    id: "discount",
    name: "Discount Range",
    options: [
      { value: "10", label: "10% And Above" },
      { value: "20", label: "20% And Above" },
      { value: "30", label: "30% And Above" },
      { value: "40", label: "40% And Above" },
      { value: "50", label: "50% And Above" },
      { value: "60", label: "60% And Above" },
      { value: "70", label: "70% And Above" },
      { value: "80", label: "80% And Above" },
    ],
  },
  {
    id: "stock",
    name: "Availability",
    options: [
      { value: "in_stock", label: "In Stock" },
      { value: "out_of_stock", label: "Out Of Stock" },
    ],
  },
];
