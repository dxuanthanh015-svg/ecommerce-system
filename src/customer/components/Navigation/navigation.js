import { product_mock_data } from '../../../Data/product_mock_data';

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

const displayNames = {
  // topLavelCategory
  women: 'Women',
  men: 'Men',
  unisex: 'Unisex',
  accessories: 'Accessories',
  // secondLavelCategory
  clothing: 'Clothing',
  shoes: 'Shoes',
  bags_accessories: 'Bags & Accessories',
  // thirdLavelCategory
  dresses: 'Dresses',
  tops_blouses: 'Tops & Blouses',
  trousers_pants: 'Trousers & Pants',
  jackets_coats: 'Jackets & Coats',
  hoodies_sweatshirts: 'Hoodies & Sweatshirts',
  t_shirts: 'T-Shirts',
  suits_blazers: 'Suit Blazers',
  heels: 'High Heels',
  boots: 'Boots',
  sports_shoes: 'Running & Sports Shoes',
  casual_shoes: 'Casual Sneakers',
  bags_handbags: 'Handbags & Purses',
  wallets: 'Wallets',
  sunglasses: 'Sunglasses',
  watches: 'Watches',
  hats_caps: 'Hats & Caps',
};

const toDisplayName = (id) =>
  displayNames[id] ??
  id.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

function buildNavigation(products) {
  const tree = {};

  for (const p of products) {
    const topId = p.topLavelCategory?.toLowerCase();
    const secId = p.secondLavelCategory?.toLowerCase();
    const thrId = p.thirdLavelCategory?.toLowerCase();

    if (!topId) continue;
    if (!tree[topId]) tree[topId] = {};
    if (secId) {
      if (!tree[topId][secId]) tree[topId][secId] = new Set();
      if (thrId) tree[topId][secId].add(thrId);
    }
  }

  const categories = Object.entries(tree).map(([topId, sections]) => ({
    id: topId,
    name: toDisplayName(topId),
    href: `/${topId}`,
    featured: featuredByCategory[topId] ?? [],
    sections: Object.entries(sections).map(([secId, thirdIds]) => ({
      id: secId,
      name: toDisplayName(secId),
      items: [...thirdIds].map((thrId) => ({
        id: thrId,
        name: toDisplayName(thrId),
        href: `/${topId}/${secId}/${thrId}`,
      })),
    })),
  }));

  return {
    categories,
    pages: [
      { name: 'All Products', href: '/product' },
      { name: 'Flash Sale 🔥', href: '/flashsale' },
      { name: 'Trending 🚀', href: '/trending' },
    ],
  };
}

export const navigation = buildNavigation(product_mock_data);