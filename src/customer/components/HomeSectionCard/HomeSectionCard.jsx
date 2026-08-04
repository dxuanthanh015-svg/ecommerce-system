import React from "react";

const HomeSectionCard = ({product}) => {
  return (
    <div className='cursor-pointer flex flex-col items-center bg-white rounded-lg shadow-lg overflow-hidden w-[14rem] h-[20rem] mx-3 '>
        <div className='h-[13rem] w-[10rem]'>
            <img className="object-cover object-contain w-full h-full  " src = {product.imageUrl} alt="" role="presentation"/>

        </div>

        <div className='p-4 text-center w-full h-[7rem] flex flex-col justify-between'>
            <h3 className="text-lg font-medium text-gray-900">{product.brand}</h3>
            <p className="mt-2 text-sm text-gray-500 line-clamp-2 overflow-hidden">{product.title}</p>
        </div>
    </div>
  );
};

export default HomeSectionCard;
