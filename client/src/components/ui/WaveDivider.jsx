import React from "react";

export const WaveDivider = ({ flip = false, color = "#FFFDF8", className = "" }) => {
  return (
    <div className={`w-full overflow-hidden leading-none ${className} ${flip ? "rotate-180" : ""}`}>
      <svg
        className="relative block w-full h-8 md:h-14"
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,60 L1200,120 L0,120 Z"
          fill={color}
        ></path>
      </svg>
    </div>
  );
};
