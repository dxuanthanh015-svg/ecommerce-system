import React, { useState } from "react";
import CategoryTree from "./CategoryTree";
import StatCards from "./StatCards";
import CategoryConfigForm from "./CategoryConfigForm";
import AttributeOverridesTable from "./AttributeOverridesTable";
import ImportCSVButton from "./ImportCSVButton";
import { CATEGORY_TREE, CATEGORY_STATS } from "./categoryManagement.data";
import toast from "react-hot-toast";

const CategoryManagement = () => {
  const defaultCategory = CATEGORY_TREE[0]?.children?.[0] || CATEGORY_TREE[0];
  const [selected, setSelected] = useState({
    ...defaultCategory,
    breadcrumb: `${CATEGORY_TREE[0]?.name} › ${defaultCategory?.name}`,
    attributes: [
      { name: 'Storage Capacity', type: 'Dropdown' },
      { name: 'Network Compatibility', type: 'Multi-select' },
    ],
  });

  const handleSelect = (node) => {
    const parent = CATEGORY_TREE.find((p) => p.children?.some((c) => c.id === node.id));
    setSelected({
      ...node,
      breadcrumb: parent ? `${parent.name} › ${node.name}` : node.name,
      attributes: node.attributes || selected.attributes,
    });
  };

  const handleSave = (form) => {
    console.log('Save category', form);
    toast.success('Saved (mock)');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Marketplace Categories & Commission</h1>
          <p className="text-base text-gray-500 mt-1">Manage category taxonomy, structure, and global commission rules.</p>
        </div>
        <div className="flex items-center gap-3">
          <ImportCSVButton onImport={() => toast.success('Import (mock)')} />
          <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Root Category
          </button>
        </div>
      </div>

      <StatCards stats={CATEGORY_STATS} />

      <div className="grid grid-cols-12 gap-6 mt-6">
        <aside className="col-span-3">
          <CategoryTree tree={CATEGORY_TREE} onSelect={handleSelect} selectedId={selected?.id} />
        </aside>

        <main className="col-span-9 space-y-6">
          <CategoryConfigForm category={selected} onSave={handleSave} />
          <AttributeOverridesTable attributes={selected.attributes} onEdit={(a)=>toast.success('Edit attr: '+a.name)} />
        </main>
      </div>
    </div>
  );
};

export default CategoryManagement;