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
    <div className="min-h-screen bg-gray-50 p-0 font-sans">
      <div className="mb-5 flex flex-col gap-4 sm:mb-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Marketplace Categories & Commission</h1>
          <p className="mt-1 text-sm text-gray-500 sm:text-base">Manage category taxonomy, structure, and global commission rules.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 sm:px-5 sm:text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Import CSV
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-2.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-gray-800 sm:px-5 sm:text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Root Category
          </button>
        </div>
      </div>

      <StoreStats stats={stats} />

      <div className="mt-4 grid grid-cols-1 gap-4 lg:mt-6 lg:grid-cols-12 lg:gap-6">
        <aside className="lg:col-span-3">
          <StoreTaxonomy tree={tree} onSelect={handleSelect} selectedId={selected?.id} />
        </aside>

        <main className="min-w-0 space-y-6 lg:col-span-9">
          <StoreConfigForm category={selected} onSave={handleSave} />
          <AttributeOverridesTable attributes={selected?.attributes || []} onEdit={handleEditAttribute} />
        </main>
      </div>
    </div>
  );
};

export default StoreSettingsMain;
