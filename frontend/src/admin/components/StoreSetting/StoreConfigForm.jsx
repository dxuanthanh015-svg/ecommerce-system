import React, { useEffect, useState } from "react";

const StoreConfigForm = ({ category = {}, onSave = () => {} }) => {
  const [form, setForm] = useState({
    name: '',
    slug: '',
    commission: '',
    visibility: 'active',
  });

  useEffect(() => {
    if (category && category.name) {
      setForm({
        name: category.name || '',
        slug: category.slug || '',
        commission: category.commission || '',
        visibility: category.visibility || 'active',
      });
    }
  }, [category]);

  const handleChange = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Category Configuration</h3>
        <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">{category?.breadcrumb || 'No category selected'}</div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">Category Name</label>
          <input 
            value={form.name} 
            onChange={handleChange('name')} 
            placeholder="Enter category name"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">URL Slug</label>
          <input 
            value={form.slug} 
            onChange={handleChange('slug')} 
            placeholder="category-url-slug"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">Global Commission Rate (%)</label>
          <input 
            value={form.commission} 
            onChange={handleChange('commission')} 
            placeholder="8.0"
            type="number"
            step="0.1"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">Visibility Status</label>
          <select 
            value={form.visibility} 
            onChange={handleChange('visibility')} 
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
          >
            <option value="active">Active (Visible to users)</option>
            <option value="inactive">Inactive (Hidden)</option>
          </select>
        </div>
      </div>

      <div className="mt-8 flex flex-col-reverse items-stretch justify-end gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:items-center">
        <button className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">Discard Changes</button>
        <button className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-gray-800" onClick={() => onSave(form)}>Save Configuration</button>
      </div>
    </div>
  );
};

export default StoreConfigForm;
