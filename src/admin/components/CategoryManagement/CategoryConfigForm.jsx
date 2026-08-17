import React, { useEffect, useState } from "react";

const CategoryConfigForm = ({ category = {}, onSave = () => {} }) => {
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
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Category Configuration</h3>
        <div className="text-sm text-gray-500">{category?.breadcrumb || ''}</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold mb-1">Category Name</label>
          <input value={form.name} onChange={handleChange('name')} className="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">URL Slug</label>
          <input value={form.slug} onChange={handleChange('slug')} className="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Global Commission Rate (%)</label>
          <input value={form.commission} onChange={handleChange('commission')} className="w-full border rounded px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Visibility Status</label>
          <select value={form.visibility} onChange={handleChange('visibility')} className="w-full border rounded px-3 py-2 text-sm">
            <option value="active">Active (Visible to users)</option>
            <option value="inactive">Inactive (Hidden)</option>
          </select>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        <button className="px-4 py-2 border rounded">Discard Changes</button>
        <button className="px-4 py-2 bg-black text-white rounded" onClick={() => onSave(form)}>Save Configuration</button>
      </div>
    </div>
  );
};

export default CategoryConfigForm;
