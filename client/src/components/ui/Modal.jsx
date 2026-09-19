import React, { useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Modal = ({ isOpen, onClose, title, children, maxWidth = "max-w-lg" }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm transition-opacity"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className={`relative w-full ${maxWidth} bg-white rounded-2xl shadow-2xl z-10 overflow-hidden border border-gray-100`}
          >
            {title && (
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-brand-cream/60">
                <h3 className="text-lg font-bold text-brand-navy font-serif">{title}</h3>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-gray-400 hover:text-brand-rose hover:bg-brand-rose/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            )}
            <div className="p-6 max-h-[85vh] overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
