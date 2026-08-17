import React from "react";

const AttributeOverridesTable = ({ attributes = [], onEdit = () => {} }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm mt-4">
      <h4 className="text-sm font-semibold mb-3">Attribute Overrides</h4>
      <table className="w-full text-sm">
        <thead className="text-xs text-gray-500">
          <tr>
            <th className="p-2 text-left">Attribute Name</th>
            <th className="p-2 text-left">Type</th>
            <th className="p-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {attributes.map((a) => (
            <tr key={a.name} className="border-t">
              <td className="p-2">{a.name}</td>
              <td className="p-2">{a.type}</td>
              <td className="p-2 text-right">
                <button className="text-sm text-indigo-600" onClick={() => onEdit(a)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-3 text-sm">
        <button className="text-sm text-gray-600">Add Custom Attribute</button>
      </div>
    </div>
  );
};

export default AttributeOverridesTable;
