import React, { forwardRef } from "react";

export const Input = forwardRef(
  ({ label, error, helperText, icon: Icon, className = "", ...props }, ref) => {
    return (
      <div className="w-full text-start">
        {label && (
          <label className="block text-xs font-semibold uppercase tracking-wider text-brand-navy mb-1.5">
            {label}
          </label>
        )}
        <div className="relative rounded-xl shadow-sm">
          {Icon && (
            <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-gray-400">
              <Icon size={18} />
            </div>
          )}
          <input
            ref={ref}
            className={`block w-full rounded-xl border border-gray-200 bg-white py-2.5 px-3.5 text-sm text-brand-navy placeholder:text-gray-400 focus:border-brand-rose focus:ring-1 focus:ring-brand-rose transition-colors duration-200 outline-none ${
              Icon ? "ps-10" : ""
            } ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""} ${className}`}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-xs text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
