import React from "react";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

const VariantsSection = ({ 
  variants, 
  generatedMatrix, 
  newSizeTag, 
  setNewSizeTag, 
  handleAddSizeTag, 
  handleRemoveSizeTag, 
  handleMatrixChange 
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-100 shadow-2xs space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <h2 className="text-base sm:text-lg font-bold text-gray-900">
          Variants
        </h2>
        <button type="button" className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer flex items-center gap-1">
          <AddIcon sx={{ fontSize: 16 }} />
          <span>Add Option</span>
        </button>
      </div>

      {/* Option 1: Size */}
      <div className="bg-[#f8f9fc] rounded-2xl p-5 border border-gray-200/80 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-700">Option 1</span>
          <button type="button" className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <CloseIcon sx={{ fontSize: 16 }} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
          <input
            type="text"
            value="Size"
            readOnly
            className="bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-bold text-gray-900"
          />

          <div className="sm:col-span-3 flex flex-wrap items-center gap-2 bg-white border border-gray-200 rounded-xl p-2 min-h-[42px]">
            {variants.find((v) => v.optionName === "Size")?.values.map((size) => (
              <span key={size} className="bg-indigo-50 text-indigo-700 font-bold text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 border border-indigo-100">
                <span>{size}</span>
                <button type="button" onClick={() => handleRemoveSizeTag(size)} className="hover:text-indigo-900 cursor-pointer">
                  <CloseIcon sx={{ fontSize: 12 }} />
                </button>
              </span>
            ))}

            <input
              type="text"
              value={newSizeTag}
              onChange={(e) => setNewSizeTag(e.target.value)}
              onKeyDown={handleAddSizeTag}
              placeholder="Type and press enter..."
              className="flex-1 bg-transparent border-none focus:outline-none text-xs text-gray-900 placeholder-gray-400 min-w-[120px]"
            />
          </div>
        </div>
      </div>

      {/* Option 2: Color */}
      <div className="bg-[#f8f9fc] rounded-2xl p-5 border border-gray-200/80 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-700">Option 2</span>
          <button type="button" className="text-gray-400 hover:text-gray-600 cursor-pointer">
            <CloseIcon sx={{ fontSize: 16 }} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-start">
          <input
            type="text"
            value="Color"
            readOnly
            className="bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-bold text-gray-900"
          />

          <div className="sm:col-span-3 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-400 cursor-pointer">
                <ImageIcon sx={{ fontSize: 16 }} />
              </div>
              <input
                type="text"
                value="Black"
                readOnly
                className="flex-1 bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-bold text-gray-900"
              />
              <button type="button" className="text-gray-400 hover:text-rose-600 p-1 cursor-pointer">
                <DeleteOutlineOutlinedIcon sx={{ fontSize: 18 }} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-400 cursor-pointer">
                <ImageIcon sx={{ fontSize: 16 }} />
              </div>
              <input
                type="text"
                value="White"
                readOnly
                className="flex-1 bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-bold text-gray-900"
              />
              <button type="button" className="text-gray-400 hover:text-rose-600 p-1 cursor-pointer">
                <DeleteOutlineOutlinedIcon sx={{ fontSize: 18 }} />
              </button>
            </div>

            <button type="button" className="text-xs font-bold text-indigo-600 hover:underline pt-1 cursor-pointer flex items-center gap-1">
              <AddIcon sx={{ fontSize: 14 }} />
              <span>Add Value</span>
            </button>
          </div>
        </div>
      </div>

      {/* Generated Matrix Table */}
      <div>
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
          Generated Variants
        </h3>
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-100/70 border-b border-gray-200 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-2.5 px-4">Variant</th>
                <th className="py-2.5 px-4">Price ($)</th>
                <th className="py-2.5 px-4">Stock</th>
                <th className="py-2.5 px-4">SKU</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {generatedMatrix.map((row, idx) => (
                <tr key={row.id || idx}>
                  <td className="py-3 px-4 flex items-center gap-2 font-bold text-gray-900">
                    <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-gray-400">
                      <ImageIcon sx={{ fontSize: 14 }} />
                    </div>
                    <span>{row.variant}</span>
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      value={row.price}
                      onChange={(e) => handleMatrixChange(idx, "price", e.target.value)}
                      className="w-24 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-900 font-bold"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      value={row.stock}
                      onChange={(e) => handleMatrixChange(idx, "stock", e.target.value)}
                      className="w-20 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-900 font-bold"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={row.sku}
                      onChange={(e) => handleMatrixChange(idx, "sku", e.target.value)}
                      className="w-32 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-900 font-bold uppercase"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VariantsSection;
