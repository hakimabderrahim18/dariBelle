import React from "react";

export const HouseBadge = ({ children, className = "", color = "bg-brand-rose", text = "text-white" }) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center px-4 py-2 text-xs font-bold uppercase tracking-wider ${color} ${text} shadow-md clip-house transition-transform duration-300 hover:scale-105 ${className}`}
    >
      {children}
    </div>
  );
};
