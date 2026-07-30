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
      { value: "159-399", label: "$159 To $399" },
      { value: "399-999", label: "$399 To $999" },
      { value: "999-1999", label: "$999 To $1999" },
      { value: "1999-2999", label: "$1999 To $2999" },
      { value: "3999-4999", label: "$3999 To $4999" },
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