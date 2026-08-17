import React, { useState } from "react";
import CategoryTree from "../components/CategoryManagement/CategoryTree";
import StatCards from "../components/CategoryManagement/StatCards";
import CategoryConfigForm from "../components/CategoryManagement/CategoryConfigForm";
import AttributeOverridesTable from "../components/CategoryManagement/AttributeOverridesTable";
import ImportCSVButton from "../components/CategoryManagement/ImportCSVButton";
import { CATEGORY_TREE, CATEGORY_STATS } from "../components/CategoryManagement/categoryManagement.data";

const AdminCategoriesPage = () => {
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
    // placeholder: replace with API call
    console.log('Save category', form);
    alert('Saved (mock)');
  };

  return (
    <div className="min-h-screen bg-[#f8f7f9] font-sans p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Marketplace Categories & Commission</h1>
          <p className="text-sm text-gray-500">Manage category taxonomy, structure, and global commission rules.</p>
        </div>
        <div className="flex items-center gap-3">
          <ImportCSVButton onImport={() => alert('Import (mock)')} />
          <button className="px-4 py-2 bg-black text-white rounded">+ New Root Category</button>
        </div>
      </div>

      <StatCards stats={CATEGORY_STATS} />

      <div className="grid grid-cols-12 gap-6 mt-6">
        <aside className="col-span-3">
          <CategoryTree tree={CATEGORY_TREE} onSelect={handleSelect} selectedId={selected?.id} />
        </aside>

        <main className="col-span-9">
          <CategoryConfigForm category={selected} onSave={handleSave} />
          <AttributeOverridesTable attributes={selected.attributes} onEdit={(a)=>alert('Edit attr: '+a.name)} />
        </main>
      </div>
    </div>
  );
};

export default AdminCategoriesPage;
