import React from "react";

const AttributeOverridesTable = ({ attributes = [], onEdit = () => {} }) => {
  if (!attributes || attributes.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-gray-900">Attribute Overrides</h4>
        </div>
        <div className="text-sm text-gray-500 py-8 text-center">No attributes configured</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-gray-900">Attribute Overrides</h4>
        <span className="text-xs text-gray-500">{attributes.length} attributes</span>
      </div>
      <table className="w-full text-sm">
        <thead className="text-xs text-gray-500 bg-gray-50 font-semibold uppercase tracking-wider">
          <tr>
            <th className="p-4 text-left">Attribute Name</th>
            <th className="p-4 text-left">Type</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {attributes.map((a) => (
            <tr key={a.name} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="p-4 font-medium text-gray-900">{a.name}</td>
              <td className="p-4 text-gray-600">{a.type}</td>
              <td className="p-4 text-right">
                <button 
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors" 
                  onClick={() => onEdit(a)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Custom Attribute
        </button>
      </div>
    </div>
  );
};

export default AttributeOverridesTable;
