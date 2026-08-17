import React from "react";

const ImportCSVButton = ({ onImport = () => {} }) => {
  return (
    <button onClick={onImport} className="px-4 py-2 bg-white border rounded shadow-sm">
      Import CSV
    </button>
  );
};

export default ImportCSVButton;
