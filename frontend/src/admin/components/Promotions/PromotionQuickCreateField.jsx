import React from "react";

const baseInputClassName =
  "w-full rounded-xl border border-[#d6dcef] bg-[#f7f8fc] px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100";

const PromotionQuickCreateField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  options,
  className = "",
}) => {
  return (
    <label className={`block ${className}`}>
      {label ? (
        <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
          {label}
        </span>
      ) : null}

      {options ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`${baseInputClassName} cursor-pointer`}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={baseInputClassName}
        />
      )}
    </label>
  );
};

export default PromotionQuickCreateField;
