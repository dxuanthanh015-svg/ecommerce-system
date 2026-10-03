import React from "react";

const TreeNode = ({ node, level = 0, onSelect, selectedId }) => {
  const hasChildren = Array.isArray(node.children) && node.children.length > 0;
  return (
    <div style={{ paddingLeft: level * 16 }}>
      <div
        onClick={() => onSelect(node)}
        className={`flex items-center gap-2 p-2.5 rounded-lg cursor-pointer transition-all ${selectedId === node.id ? 'bg-blue-50 text-blue-900 font-medium' : 'hover:bg-gray-50 text-gray-700'}`}>
        {hasChildren && (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
        <div className="text-sm">{node.name}</div>
        {node.percentage && (
          <span className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{node.percentage}</span>
        )}
      </div>
      {hasChildren && (
        <div className="ml-4">
          {node.children.map((c) => (
            <TreeNode key={c.id} node={c} level={level + 1} onSelect={onSelect} selectedId={selectedId} />
          ))}
        </div>
      )}
    </div>
  );
};

const StoreTaxonomy = ({ tree = [], onSelect = () => {}, selectedId }) => {
  if (!tree || tree.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 h-full">
        <h3 className="text-sm font-semibold mb-4 text-gray-900">Taxonomy</h3>
        <div className="text-sm text-gray-500 py-8 text-center">No categories available</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 h-full">
      <h3 className="text-sm font-semibold mb-4 text-gray-900">Taxonomy</h3>
      <div className="overflow-auto max-h-[60vh]">
        {tree.map((node) => (
          <TreeNode key={node.id} node={node} onSelect={onSelect} selectedId={selectedId} />
        ))}
      </div>
    </div>
  );
};

export default StoreTaxonomy;
