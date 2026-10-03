import React from 'react';

const InspirationCard = ({ icon, title, description, image }) => {
  return (
    <div className="group relative overflow-hidden rounded-md shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 min-h-[380px]">
      <img
        src={image}
        alt={title}
        className="h-96 w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/90 to-transparent text-white">
        <div className="mb-4 inline-flex items-center justify-center rounded-full bg-white/10 p-3 text-white w-12 h-12">
          {icon}
        </div>
        <h3 className="text-xl font-semibold tracking-tight mb-2">{title}</h3>
        <p className="text-sm text-white leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default InspirationCard;
