import React from "react";
import { validateField } from "../../utils/validationUtils";

/**
 * A reusable form field component with built-in validation
 */
const FormField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  validation = {},
  errors = {},
  setErrors = () => {},
  helpText,
  className = "",
  children,
  checked,
  darkmode,
  ...props
}) => {
  // Handle input change
  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(e);

    // Validate on change if there's already an error for this field
    if (errors[name]) {
      validateField(name, newValue, validation, errors, setErrors);
    }
  };

  // Validate on blur
  const handleBlur = (e) => {
    validateField(name, value, validation, errors, setErrors);
    if (onBlur) onBlur(e);
  };

  // Determine if field has an error
  const hasError = !!errors[name];

  // Common class for input elements
  const inputClass = `mt-1 block w-full border ${
    hasError ? "border-red-500" : "border-gray-300 dark:border-gray-600"
  } rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`;

  return (
    <div className={`${className}`}>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          value={value || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={inputClass}
          {...props}
        />
      ) : type === "select" ? (
        <select
          id={name}
          name={name}
          value={value || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          className={inputClass}
          {...props}
        >
          {children}
        </select>
      ) : type === "checkbox" ? (
        <div className="mt-1 flex items-center">
          <input
            type="checkbox"
            id={name}
            name={name}
            checked={checked}
            onChange={onChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            {...props}
          />
          <label
            htmlFor={name}
            className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
          >
            {helpText}
          </label>
        </div>
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={value || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={inputClass}
          {...props}
        />
      )}

      {helpText && !hasError && type !== "checkbox" && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {helpText}
        </p>
      )}

      {hasError && <p className="mt-1 text-xs text-red-500">{errors[name]}</p>}
    </div>
  );
};

export default FormField;
