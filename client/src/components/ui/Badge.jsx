import React from "react";

export const Badge = ({ children, variant = "default", className = "" }) => {
  const styles = {
    default: "bg-gray-100 text-gray-700",
    promo: "bg-brand-rose text-white font-bold",
    new: "bg-brand-teal text-white font-bold",
    bestseller: "bg-brand-yellow text-brand-navy font-bold",
    warning: "bg-amber-100 text-amber-800 border border-amber-300",
    danger: "bg-red-100 text-red-700 border border-red-200",
    success: "bg-emerald-100 text-emerald-800 border border-emerald-300",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide shadow-sm ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
