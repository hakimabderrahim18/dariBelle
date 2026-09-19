import React from "react";

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  loading = false,
  type = "button",
  onClick,
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center font-medium transition-all duration-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";

  const variants = {
    primary:
      "bg-brand-rose text-white hover:bg-[#b81f42] focus:ring-brand-rose shadow-md hover:shadow-lg",
    secondary:
      "bg-brand-navy text-white hover:bg-brand-darkNavy focus:ring-brand-navy shadow-sm hover:shadow",
    gold:
      "bg-brand-yellow text-brand-navy hover:bg-[#dda024] focus:ring-brand-yellow font-semibold shadow-md",
    teal:
      "bg-brand-teal text-white hover:bg-[#349e91] focus:ring-brand-teal shadow-md",
    outline:
      "border-2 border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white focus:ring-brand-navy",
    outlineRose:
      "border-2 border-brand-rose text-brand-rose hover:bg-brand-rose hover:text-white focus:ring-brand-rose",
    ghost:
      "text-brand-navy hover:bg-brand-yellow/15 focus:ring-brand-yellow",
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-sm px-5 py-2.5 gap-2",
    lg: "text-base px-7 py-3.5 gap-2.5 font-semibold",
    xl: "text-lg px-8 py-4 gap-3 font-bold",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
};
