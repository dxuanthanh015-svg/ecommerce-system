import React from 'react';
import MainCarousal from '../../components/HomeCarousel/MainCarousel';
import HomeSectionCarousel from '../../components/HomeSectionCarousel/HomeSectionCarousel';
import { trendingProducts } from '../../../Data/trending-products';
import { Link } from 'react-router-dom';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import FlashSaleSection from '../../components/FlashSaleSection/FlashSaleSection';

const categories = [
  {
    id: 1,
    title: "Women's Collection",
    subtitle: "Shop Now →",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
    link: "/women/clothing/tops"
  },
  {
    id: 2,
    title: "Men's Suit",
    subtitle: "Shop Now →",
    image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop",
    link: "/men/clothing/mens_kurta"
  },
  {
    id: 3,
    title: "Accessories",
    subtitle: "Shop Now →",
    image: "https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?q=80&w=800&auto=format&fit=crop",
    link: "/women/accessories/bags"
  }
];

const HomePage = () => {
  return (
    <div className="w-full bg-white min-h-screen">
      {/* 1. Main Hero Carousel */}
      <MainCarousal />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 py-16">
        
        {/* 2. Explore Categories */}
        <section className="w-full">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center tracking-tight mb-10">
            Explore Categories
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={cat.link}
                className="group relative h-[380px] sm:h-[420px] rounded-md overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer block"
              >
                {/* Background Image */}
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                {/* Text Content Overlay */}
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight drop-shadow-sm">
                    {cat.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-gray-200 group-hover:text-indigo-300 transition-colors flex items-center gap-1">
                    {cat.subtitle}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
        
        <section className="w-full">
          <FlashSaleSection/>
        </section>    

        {/* 3. Trending Now Carousel Section */}
        <section className="w-full">
          <HomeSectionCarousel data={trendingProducts} sectionName="Trending Now" />
        </section>
        

        {/* 4. The NexCart Experience Section */}
        <section className="w-full bg-[#f4f7fc] rounded-3xl p-8 sm:p-12 lg:p-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-12">
            The NexCart Experience
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center space-y-4">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                <LocalShippingOutlinedIcon sx={{ fontSize: 28 }} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Complimentary Delivery
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                Enjoy free, fast standard shipping on all orders over $50, delivered straight to your door.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center space-y-4">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                <VerifiedOutlinedIcon sx={{ fontSize: 28 }} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Uncompromising Quality
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                Every item is rigorously vetted for premium materials and craftsmanship, settled to satisfy you.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center space-y-4">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                <AutorenewOutlinedIcon sx={{ fontSize: 28 }} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Seamless Returns
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                Not quite right? Our 30-day return policy is designed to be as effortless as your shopping experience.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default HomePage;

