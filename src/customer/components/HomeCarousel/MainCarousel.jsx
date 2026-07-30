import React from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { mainCarouselData } from './MainCarouselData';



const MainCarousal = () => {
    const Carousel = AliceCarousel.default || AliceCarousel;

    const items = mainCarouselData.map((item) => <img className="w-full h-[600px] object-cover object-center cursor-pointer"
 src={item.image} role='presentation' alt = ""/>)

    return (
          <Carousel
        disableButtonsControls
        items={items}
        infinite
        autoPlay
        autoPlayInterval={1000}
      />
    )
};

export default MainCarousal;