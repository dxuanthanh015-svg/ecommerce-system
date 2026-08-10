import React from "react";

const CategorizationSection = ({ 
  level1Category, 
  level2Category, 
  level3Category, 
  tags, 
  handleChange 
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-2xs space-y-4">
      <h3 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100">
        Categorization
      </h3>

      <div>
        <label className="text-xs font-bold text-gray-700 block mb-1.5">
          Level 1 Category *
        </label>
        <select
          name="level1Category"
          value={level1Category}
          onChange={handleChange}
          className="w-full bg-[#f8f9fc] border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-900 font-medium cursor-pointer transition-all"
        >
          <option value="">Select main category</option>
          <option value="Electronics">Electronics</option>
          <option value="Apparel">Apparel</option>
          <option value="Home Goods">Home Goods</option>
        </select>
      </div>

      <div>
        <label className="text-xs font-bold text-gray-700 block mb-1.5">
          Level 2 Category
        </label>
        <select
          name="level2Category"
          value={level2Category}
          onChange={handleChange}
          className="w-full bg-[#f8f9fc] border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-900 font-medium cursor-pointer transition-all"
        >
          <option value="">Select sub-category</option>
          <option value="Audio">Audio</option>
          <option value="Men's Wear">Men's Wear</option>
          <option value="Kitchen">Kitchen</option>
        </select>
      </div>

      <div>
        <label className="text-xs font-bold text-gray-700 block mb-1.5">
          Level 3 Category
        </label>
        <select
          name="level3Category"
          value={level3Category}
          onChange={handleChange}
          className="w-full bg-[#f8f9fc] border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-900 font-medium cursor-pointer transition-all"
        >
          <option value="">Select specific category</option>
          <option value="Headphones">Headphones</option>
          <option value="T-Shirts">T-Shirts</option>
          <option value="Vases">Vases</option>
        </select>
      </div>

      <div>
        <label className="text-xs font-bold text-gray-700 block mb-1.5">
          Tags
        </label>
        <input
          type="text"
          name="tags"
          value={tags}
          onChange={handleChange}
          placeholder="e.g. Summer, New Arrival"
          className="w-full bg-[#f8f9fc] border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-900 font-medium transition-all"
        />
      </div>
    </div>
  );
};

export default CategorizationSection;
