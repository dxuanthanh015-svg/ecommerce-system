import React from "react";
import { useLocation } from "react-router-dom";


export default function ProductHeader() {
  const location = useLocation();
  const path = location.pathname;
  const mapTitle = {
    '/product': ['ALL PRODUCTS', "Explore our complete collection of timeless essentials, crafted for elevated everyday style."],
    '/men': ['MEN COLLECTION', "Refined tailoring and modern essentials tailored for the contemporary gentleman."],
    '/women': ['WOMEN COLLECTION', "Elegantly designed pieces blending sophistication, comfort, and modern silhouettes."],
    '/unisex': ['UNISEX COLLECTION', "Versatile, gender-neutral designs crafted with fluid cuts and clean aesthetics for everyone."],
    '/accessories': ['ACCESSORIES', 'Elevate your everyday ensemble with our curated range of functional luxury accents.'],
    '/flashsale': ['FLASH SALE', 'Exclusive discounts on iconic styles. High quality meets unbeatable value for a short time.'],
    '/trending': ['TRENDING PRODUCTS', 'Curated bestsellers and seasonal favorites currently defining modern street fashion.']
  }

  return (


    <div className="bg-gradient-to-b from-indigo-50/70 via-blue-50/30 to-white py-14 px-4 sm:px-6 lg:px-8 text-center border-b border-gray-100">
      <span className="px-3.5 py-1 bg-indigo-100/80 text-indigo-600 text-[11px] font-bold rounded-full uppercase tracking-wider mb-3 inline-block">
        Style Collection
      </span>
      <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-3">
        {mapTitle[path] ? mapTitle[path][0] : mapTitle['/product'][0]}
      </h1>
      <p className="text-gray-500 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
        {mapTitle[path] ? mapTitle[path][1] : mapTitle['/product'][1]}
      </p>
    </div>
  );
}
