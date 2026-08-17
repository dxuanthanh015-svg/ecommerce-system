import React from 'react';
import MainCarousal from './HomeCarousel/MainCarousel';
import HomeSectionCarousel from './HomeSectionCarousel/HomeSectionCarousel';
import { Link } from 'react-router-dom';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import FlashSaleSection from './FlashSaleSection/FlashSaleSection';
import InspirationCard from './InspirationCard/InspirationCard';
import { inspirationItems } from './InspirationCard/inspiration-data';
import { product_mock_data } from '../../../Data/product_mock_data.js';

const categories = [
  {
    id: 1,
    title: "Women's Collection",
    subtitle: "Shop Now →",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
    link: "/women"
  },
  {
    id: 2,
    title: "Men's Collection",
    subtitle: "Shop Now →",
    image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop",
    link: "/men"
  },
  {
    id: 3,
    title: "Accessories",
    subtitle: "Shop Now →",
    image: "https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?q=80&w=800&auto=format&fit=crop",
    link: "/accessories"
  }
];

const Home = () => {
  const trendingProduct = product_mock_data.filter(product => product.isTrending === true).slice(0, 10);
  return (
    <div className="w-full bg-white min-h-screen">
      <MainCarousal />

      <div className="w-full mx-auto   space-y-20 pt-16">
        <section className="w-full">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
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
          </div>
          
        </section>

        <section className="w-full">
          <FlashSaleSection />
        </section>
        <div className="w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          <section className="w-full">
          <HomeSectionCarousel data={trendingProduct} sectionName="Trending Now" />
        </section>

        </div>
        
        <section className="w-full bg-gradient-to-b from-gray-50 to-white rounded-3xl p-8 sm:p-12 lg:p-16">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8 text-center">
              <p className="text-sm uppercase tracking-[0.32em] text-indigo-600 font-semibold mb-3">
                Social Buzz
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                To like, to comment, to be inspired
              </h2>
              <p className="mt-4 text-sm sm:text-base text-gray-500 max-w-2xl mx-auto">
                Discover trending moments from our community and get inspired by everyday style and effortless essentials.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {inspirationItems.map((item) => (
                <InspirationCard
                  key={item.id}
                  icon={item.icon}
                  title={item.title}
                  description={item.description}
                  image={item.image}
                />
              ))}
            </div>

            <div>
              <span style={{ color: '#8e4dcf'}} className = "flex justify-center align-middle mt-7 font-semibold"> JOIN US </span>
            </div>
              <div className="flex flex-wrap justify-center gap-4 mt-6 space-x-10">
                <a style={{ color: '#8e4dcf' }} className = "hover:text-indigo-800 hover:font-bold font-semibold transition-all hover:scale-105 duration-300 ease-in-out" href="https://www.instagram.com/nexcart/" target="_blank" rel="noopener noreferrer ">
                  Instagram
                </a>
                <a style={{ color: '#8e4dcf' }} className = "hover:text-indigo-800 hover:font-bold font-semibold transition-all hover:scale-105 duration-300 ease-in-out" href="https://www.facebook.com/nexcart/" target="_blank" rel="noopener noreferrer" >
                  Facebook
                </a>
                <a style={{ color: '#8e4dcf' }} className = "hover:text-indigo-800 hover:font-bold font-semibold transition-all hover:scale-105 duration-300 ease-in-out " href="https://www.tiktok.com/@nexcart" target="_blank" rel="noopener noreferrer" >
                  Tiktok
                </a>
                <a style={{ color: '#8e4dcf' }} className = "hover:text-indigo-800 hover:font-bold font-semibold transition-all hover:scale-105 duration-300 ease-in-out" href="https://www.youtube.com/@nexcart" target="_blank" rel="noopener noreferrer" >
                  Youtube
                </a>
              </div>

          </div>
        </section>

        <section className="w-full h-full bg-[#e6edf9] rounded-md p-13 sm:p-15 lg:p-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-12">
            The NexCart Experience
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="bg-white rounded-md p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center space-y-4">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                <LocalShippingOutlinedIcon sx={{ fontSize: 28 }} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Complimentary Delivery</h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                Enjoy free, fast standard shipping on all orders over $50, delivered straight to your door.
              </p>
            </div>

            <div className="bg-white rounded-md p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center space-y-4">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                <VerifiedOutlinedIcon sx={{ fontSize: 28 }} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Uncompromising Quality</h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                Every item is rigorously vetted for premium materials and craftsmanship, settled to satisfy you.
              </p>
            </div>

            <div className="bg-white rounded-md p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center space-y-4">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                <AutorenewOutlinedIcon sx={{ fontSize: 28 }} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Seamless Returns</h3>
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

export default Home;
