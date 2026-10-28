// Navigation configuration with standard e-commerce categories
const featuredByCategory = {
  women: [
    {
      name: 'Summer Dress Collection',
      href: '/women/clothing/dresses',
      imageSrc: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop',
      imageAlt: 'Floral summer midi dress for women.',
    },
    {
      name: 'Handcrafted High Heels',
      href: '/women/shoes/heels',
      imageSrc: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop',
      imageAlt: 'Pointed toe stiletto high heels.',
    },
  ],
  men: [
    {
      name: 'Winter Explorer Jackets',
      href: '/men/clothing/jackets_coats',
      imageSrc: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=800&auto=format&fit=crop',
      imageAlt: 'Waterproof winter explorer jacket for men.',
    },
    {
      name: 'Tailored Suits & Blazers',
      href: '/men/clothing/suits_blazers',
      imageSrc: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800&auto=format&fit=crop',
      imageAlt: 'Italian wool tailored suit blazer.',
    },
  ],
  unisex: [
    {
      name: 'Streetwear Fleece Hoodies',
      href: '/unisex/clothing/hoodies_sweatshirts',
      imageSrc: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop',
      imageAlt: 'Unisex fleece pullover hoodie.',
    },
    {
      name: 'Vintage Canvas Sneakers',
      href: '/unisex/shoes/casual_shoes',
      imageSrc: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=800&auto=format&fit=crop',
      imageAlt: 'Retro canvas high top sneakers.',
    },
  ],
  accessories: [
    {
      name: 'Minimalist Quartz Watches',
      href: '/accessories/bags_accessories/watches',
      imageSrc: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop',
      imageAlt: 'Minimalist analog quartz watch.',
    },
    {
      name: 'Leather Backpacks & Bags',
      href: '/accessories/bags_accessories/bags_handbags',
      imageSrc: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop',
      imageAlt: 'Waterproof laptop travel backpack.',
    },
  ],
};

const defaultCategories = [
  {
    id: 'women',
    name: 'Women',
    href: '/women',
    featured: featuredByCategory.women,
    sections: [
      {
        id: 'clothing',
        name: 'Clothing',
        items: [
          { id: 'dresses', name: 'Dresses', href: '/women/clothing/dresses' },
          { id: 'tops_blouses', name: 'Tops & Blouses', href: '/women/clothing/tops_blouses' },
          { id: 'trousers_pants', name: 'Trousers & Pants', href: '/women/clothing/trousers_pants' },
          { id: 'jackets_coats', name: 'Jackets & Coats', href: '/women/clothing/jackets_coats' },
        ],
      },
      {
        id: 'shoes',
        name: 'Shoes',
        items: [
          { id: 'heels', name: 'High Heels', href: '/women/shoes/heels' },
          { id: 'boots', name: 'Boots', href: '/women/shoes/boots' },
          { id: 'casual_shoes', name: 'Casual Sneakers', href: '/women/shoes/casual_shoes' },
        ],
      },
    ],
  },
  {
    id: 'men',
    name: 'Men',
    href: '/men',
    featured: featuredByCategory.men,
    sections: [
      {
        id: 'clothing',
        name: 'Clothing',
        items: [
          { id: 't_shirts', name: 'T-Shirts', href: '/men/clothing/t_shirts' },
          { id: 'hoodies_sweatshirts', name: 'Hoodies & Sweatshirts', href: '/men/clothing/hoodies_sweatshirts' },
          { id: 'suits_blazers', name: 'Suit Blazers', href: '/men/clothing/suits_blazers' },
          { id: 'jackets_coats', name: 'Jackets & Coats', href: '/men/clothing/jackets_coats' },
        ],
      },
      {
        id: 'shoes',
        name: 'Shoes',
        items: [
          { id: 'sports_shoes', name: 'Sports Shoes', href: '/men/shoes/sports_shoes' },
          { id: 'casual_shoes', name: 'Casual Sneakers', href: '/men/shoes/casual_shoes' },
        ],
      },
    ],
  },
  {
    id: 'unisex',
    name: 'Unisex',
    href: '/unisex',
    featured: featuredByCategory.unisex,
    sections: [
      {
        id: 'clothing',
        name: 'Clothing',
        items: [
          { id: 'hoodies_sweatshirts', name: 'Hoodies & Sweatshirts', href: '/unisex/clothing/hoodies_sweatshirts' },
          { id: 't_shirts', name: 'T-Shirts', href: '/unisex/clothing/t_shirts' },
          { id: 'trousers_pants', name: 'Trousers & Pants', href: '/unisex/clothing/trousers_pants' },
        ],
      },
      {
        id: 'shoes',
        name: 'Shoes',
        items: [
          { id: 'casual_shoes', name: 'Casual Sneakers', href: '/unisex/shoes/casual_shoes' },
        ],
      },
    ],
  },
  {
    id: 'accessories',
    name: 'Accessories',
    href: '/accessories',
    featured: featuredByCategory.accessories,
    sections: [
      {
        id: 'bags_accessories',
        name: 'Bags & Accessories',
        items: [
          { id: 'watches', name: 'Watches', href: '/accessories/bags_accessories/watches' },
          { id: 'bags_handbags', name: 'Bags & Handbags', href: '/accessories/bags_accessories/bags_handbags' },
          { id: 'sunglasses', name: 'Sunglasses', href: '/accessories/bags_accessories/sunglasses' },
          { id: 'wallets', name: 'Wallets', href: '/accessories/bags_accessories/wallets' },
        ],
      },
    ],
  },
];

export const navigation = {
  categories: defaultCategories,
  pages: [
    { name: 'All Products', href: '/product' },
    { name: 'Flash Sale 🔥', href: '/flashsale' },
    { name: 'Trending 🚀', href: '/trending' },
  ],
};