import React from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { mainCarouselData } from './MainCarouselData';
import { useNavigate } from 'react-router-dom';

const MainCarousal = () => {
    const Carousel = AliceCarousel.default || AliceCarousel;
    const navigate = useNavigate();

    const items = mainCarouselData.map((item, index) => (
        <div key={index} className="relative w-full h-[480px] sm:h-[580px] lg:h-[640px] overflow-hidden">
            <img 
                className="w-full h-full object-cover object-center"
                src={item.image} 
                role='presentation' 
                alt={item.title || "Hero banner"}
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4 sm:px-8">
                {item.badge && (
                    <span className="px-3.5 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-semibold rounded-full uppercase tracking-wider mb-4 shadow-sm">
                        {item.badge}
                    </span>
                )}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight max-w-3xl drop-shadow-md">
                    {item.title}
                </h1>
                <p className="text-white/90 text-sm sm:text-base max-w-xl mb-8 leading-relaxed font-normal drop-shadow">
                    {item.description}
                </p>
                <button 
                    onClick={() => navigate(item.path || '/product')}
                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-md text-xs sm:text-sm tracking-widest uppercase transition duration-300 shadow-xl hover:shadow-indigo-500/30 transform hover:-translate-y-0.5 cursor-pointer"
                >
                    {item.buttonText || "SHOP NOW"}
                </button>
            </div>
        </div>
    ));

    return (
        <div className="w-full relative">
            <Carousel
                disableButtonsControls
                items={items}
                infinite
                autoPlay
                autoPlayInterval={4000}
                animationDuration={800}
            />
        </div>
    );
};

export default MainCarousal;