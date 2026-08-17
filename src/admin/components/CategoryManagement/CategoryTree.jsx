import React from "react";

const TreeNode = ({ node, level = 0, onSelect, selectedId }) => {
  const hasChildren = Array.isArray(node.children) && node.children.length > 0;
  return (
    <div style={{ paddingLeft: level * 16 }}>
      <div
        onClick={() => onSelect(node)}
        className={`flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer ${selectedId === node.id ? 'bg-gray-100 font-semibold' : ''}`}>
        <div className="text-sm">{node.name}</div>
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

const CategoryTree = ({ tree = [], onSelect = () => {}, selectedId }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm h-full">
      <h3 className="text-sm font-semibold mb-3">Taxonomy</h3>
      <div className="overflow-auto max-h-[60vh]">
        {tree.map((node) => (
          <TreeNode key={node.id} node={node} onSelect={onSelect} selectedId={selectedId} />
        ))}
      </div>
    </div>
  );
};

export default CategoryTree;
