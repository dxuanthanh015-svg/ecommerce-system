import React from "react";

const VisibilitySection = ({ visibility, setVisibility }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-2xs space-y-4">
      <h3 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100">
        Visibility
      </h3>

      <div className="space-y-3">
        <label 
          onClick={() => setVisibility("Active")}
          className={`flex items-start gap-3 p-3 rounded-xl  transition-all cursor-pointer ${
            visibility === "Active" ?
             true
              : "border-gray-200"
          }`}
        >
          <input
            type="radio"
            name="visibilityRadio"
            checked={visibility === "Active"}
            onChange={() => setVisibility("Active")}
            className="mt-0.5 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
          <div>
            <p className="text-xs font-bold text-gray-900">Active</p>
          </div>
        </label>

        <label 
          onClick={() => setVisibility("Draft")}
          className={`flex items-start gap-3 p-3 rounded-xl  transition-all cursor-pointer ${
            visibility === "Draft"
              ? true
              : "border-gray-200"
          }`}
        >
          <input
            type="radio"
            name="visibilityRadio"
            checked={visibility === "Draft"}
            onChange={() => setVisibility("Draft")}
            className="mt-0.5 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
          <div>
            <p className="text-xs font-bold text-gray-900">Draft</p>
          </div>
        </label>
      </div>
    </div>
  );
};

export default VisibilitySection;
