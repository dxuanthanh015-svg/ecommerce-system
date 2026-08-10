import React, { useRef, useState, useEffect } from "react";
import HomeSectionCard from "../HomeSectionCard/HomeSectionCard";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { Button } from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Link } from "react-router-dom";

const Carousel = AliceCarousel.default || AliceCarousel;

const HomeSectionCarousel = ({ data, sectionName }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(4);
  const carouselRef = useRef(null);
  const slidePrev = () => carouselRef.current?.slidePrev();
  const slideNext = () => carouselRef.current?.slideNext();

  const responsive = {
    0: { items: 1.2 },
    640: { items: 2.3 },
    1024: { items: 4 },
  };

  useEffect(() => {
    const updateVisibleItems = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setVisibleItems(4);
      } else if (width >= 640) {
        setVisibleItems(2);
      } else {
        setVisibleItems(1);
      }
    };

    updateVisibleItems();
    window.addEventListener("resize", updateVisibleItems);
    return () => window.removeEventListener("resize", updateVisibleItems);
  }, []);

  const syncActiveIndex = ({ item }) => setActiveIndex(item);

  const items = data
    ?.slice(0, 10)
    .map((product, index) => (
      <HomeSectionCard key={product.id || index} product={product} />
    ));

  return (
    <div className="w-full my-6">
      {/* Section Header */}
      <div className="flex items-center justify-between py-4 border-b border-gray-100 mb-4 px-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight font-sans">{sectionName}</h2>
        <Link 
          to="/product" 
          className="text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          See all
        </Link>
      </div>

      <div className="relative">
        <Carousel
          ref={carouselRef}
          mouseTracking
          disableButtonsControls
          items={items}
          responsive={responsive}
          disableDotsControls
          onSlideChanged={syncActiveIndex}
          activeIndex={activeIndex}
          controlsStrategy="responsive"
        />

        {items && activeIndex < items.length - visibleItems && (
          <Button
            variant="contained"
            onClick={slideNext}
            sx={{
              position: "absolute",
              top: "45%",
              right: "-1rem",
              transform: "translateY(-50%)",
              bgcolor: "white",
              color: "gray.800",
              minWidth: "40px",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              zIndex: 30,
              "&:hover": { bgcolor: "#f3f4f6" },
            }}
            aria-label="next"
          >
            <KeyboardArrowRightIcon sx={{ color: "#374151" }} />
          </Button>
        )}

        {activeIndex !== 0 && (
          <Button
            variant="contained"
            onClick={slidePrev}
            sx={{
              position: "absolute",
              top: "45%",
              left: "-1rem",
              transform: "translateY(-50%)",
              bgcolor: "white",
              color: "gray.800",
              minWidth: "40px",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              zIndex: 30,
              "&:hover": { bgcolor: "#f3f4f6" },
            }}
            aria-label="previous"
          >
            <KeyboardArrowLeftIcon sx={{ color: "#374151" }} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default HomeSectionCarousel;

