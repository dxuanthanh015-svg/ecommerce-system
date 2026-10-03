import React, { useState } from "react";
import StoreStats from "./StoreStats";
import StoreTaxonomy from "./StoreTaxonomy";
import StoreConfigForm from "./StoreConfigForm";
import AttributeOverridesTable from "./AttributeOverridesTable";
import toast from "react-hot-toast";

const StoreSettingsMain = ({ tree = [], stats = {} }) => {
  const [selected, setSelected] = useState(null);

  const handleSelect = (node) => {
    setSelected({
      ...node,
      breadcrumb: node.breadcrumb || node.name,
      attributes: node.attributes || [],
    });
  };

  const handleSave = (form) => {
    console.log('Save category', form);
    toast.success('Saved');
  };

  const handleEditAttribute = (attribute) => {
    toast.success('Edit attr: ' + attribute.name);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Marketplace Categories & Commission</h1>
          <p className="text-base text-gray-500 mt-1">Manage category taxonomy, structure, and global commission rules.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg text-sm font-medium text-gray-700 transition-colors shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Import CSV
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Root Category
          </button>
        </div>
      </div>

      <StoreStats stats={stats} />

      <div className="grid grid-cols-12 gap-6 mt-6">
        <aside className="col-span-3">
          <StoreTaxonomy tree={tree} onSelect={handleSelect} selectedId={selected?.id} />
        </aside>

        <main className="col-span-9 space-y-6">
          <StoreConfigForm category={selected} onSave={handleSave} />
          <AttributeOverridesTable attributes={selected?.attributes || []} onEdit={handleEditAttribute} />
        </main>
      </div>
    </div>
  );
};

export default StoreSettingsMain;
