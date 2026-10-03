import React from "react";
import { inputClassName, labelClassName } from "./storeSettings.utils";

export default function StoreSettingsField({
  id,
  label,
  value,
  onChange,
  name,
  type = "text",
  placeholder,
  readOnly = false,
  textarea = false,
  rows = 4,
  className = "",
}) {
  const fieldClassName = `${inputClassName} ${className}`.trim();

  return (
    <div>
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>

      {textarea ? (
        <textarea
          id={id}
          name={name}
          rows={rows}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`${fieldClassName} min-h-32 resize-none leading-7`}
        />
      ) : (
        <input
          id={id}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          className={fieldClassName}
        />
      )}
    </div>
  );
}
