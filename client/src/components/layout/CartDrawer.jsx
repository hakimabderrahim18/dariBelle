import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "../../store/cartStore";
import { useUIStore } from "../../store/uiStore";
import { formatDZD } from "../../utils/formatters";

export const CartDrawer = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const isCartOpen = useUIStore((state) => state.isCartOpen);
  const closeCart = useUIStore((state) => state.closeCart);

  const { items, removeItem, updateQuantity, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();
  const freeThreshold = 35000;
  const progress = Math.min(100, Math.round((subtotal / freeThreshold) * 100));
  const remainingForFree = Math.max(0, freeThreshold - subtotal);

  const handleCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="absolute inset-0 bg-brand-navy/60 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 end-0 flex max-w-full">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-white shadow-2xl flex flex-col"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-brand-cream/60">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={20} className="text-brand-rose" />
                  <h3 className="font-serif font-bold text-lg text-brand-navy">
                    {t("cart.title")} ({items.length})
                  </h3>
                </div>
                <button
                  onClick={closeCart}
                  className="p-2 text-gray-400 hover:text-brand-navy rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Free Shipping Progress */}
              <div className="px-6 py-3 bg-brand-lightYellow border-b border-amber-200/50">
                <div className="flex items-center justify-between text-xs text-brand-navy font-medium mb-1.5">
                  {remainingForFree > 0 ? (
                    <span>
                      {i18n.language === "ar"
                        ? `أضف بقيمة ${formatDZD(remainingForFree, true)} للاستفادة من التوصيل المجاني !`
                        : `Plus que ${formatDZD(remainingForFree)} pour la livraison gratuite !`}
                    </span>
                  ) : (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <ShieldCheck size={14} />
                      {i18n.language === "ar"
                        ? "تهانينا ! استفدت من التوصيل المجاني لطلبيتك !"
                        : "Félicitations ! Vous bénéficiez de la livraison gratuite !"}
                    </span>
                  )}
                  <span className="font-bold">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-brand-yellow h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-gray-100">
                {items.length === 0 ? (
                  <div className="py-16 text-center space-y-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
                      <ShoppingBag size={28} />
                    </div>
                    <p className="text-gray-500 text-sm">{t("cart.empty")}</p>
                    <button
                      onClick={closeCart}
                      className="inline-flex text-xs font-bold text-brand-rose uppercase tracking-wider hover:underline"
                    >
                      {t("cart.startShopping")}
                    </button>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={`${item.product}-${item.variantSku}`} className="py-4 flex gap-4">
                      <img
                        src={item.image || "https://images.unsplash.com/photo-1615865417491-9941019fbc00?w=200"}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-xl border border-gray-100 shrink-0"
                      />

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-brand-navy line-clamp-2">
                            {i18n.language === "ar" && item.nameAr ? item.nameAr : item.name}
                          </h4>
                          {item.variantName && (
                            <span className="text-[11px] text-gray-500 block">
                              Variante: {item.variantName}
                            </span>
                          )}
                          <p className="text-xs font-extrabold text-brand-rose mt-1">
                            {formatDZD(item.price, i18n.language === "ar")}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                            <button
                              onClick={() =>
                                updateQuantity(item.product, item.variantSku, item.quantity - 1)
                              }
                              className="p-1 hover:text-brand-rose transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="px-2.5 text-xs font-bold text-brand-navy">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.product, item.variantSku, item.quantity + 1)
                              }
                              className="p-1 hover:text-brand-rose transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.product, item.variantSku)}
                            className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer */}
              {items.length > 0 && (
                <div className="border-t border-gray-100 p-6 bg-brand-cream/60 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{t("cart.subtotal")}</span>
                    <span className="font-extrabold text-brand-navy text-base">
                      {formatDZD(subtotal, i18n.language === "ar")}
                    </span>
                  </div>

                  <p className="text-[11px] text-gray-400 italic">
                    {i18n.language === "ar"
                      ? "تكلفة التوصيل تُحسب تلقائياً حسب ولايتك في الخطوة القادمة."
                      : "Les frais de livraison seront calculés selon votre wilaya."}
                  </p>

                  <button
                    onClick={handleCheckout}
                    className="w-full bg-brand-rose hover:bg-[#b81f42] text-white py-3.5 px-6 rounded-xl font-bold text-sm shadow-lg shadow-brand-rose/25 flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <span>{t("cart.checkout")}</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
