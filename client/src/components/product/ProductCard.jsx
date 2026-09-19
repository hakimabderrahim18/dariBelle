import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ShoppingBag, Eye, Zap, Flame, Sparkles } from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import { useUIStore } from "../../store/uiStore";
import { formatDZD } from "../../utils/formatters";
import toast from "react-hot-toast";

export const ProductCard = ({ product }) => {
  const { t, i18n } = useTranslation();
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useUIStore((state) => state.openCart);
  const setQuickOrderProduct = useUIStore((state) => state.setQuickOrderProduct);

  const isPromo = product.salePrice && product.salePrice < product.price;
  const isNew = product.tags?.includes("new");
  const isBestseller = product.tags?.includes("bestseller");
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= (product.lowStockThreshold || 5);

  const currentPrice = isPromo ? product.salePrice : product.price;
  const discountPercent = isPromo
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addItem(product, 1);
    toast.success(
      i18n.language === "ar"
        ? `تمت إضافة "${product.name?.ar || product.name?.fr}" إلى السلة`
        : `"${product.name?.fr}" ajouté au panier`
    );
    openCart();
  };

  const handleQuickBuy = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    setQuickOrderProduct(product);
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      {/* Badges Overlay */}
      <div className="absolute top-3 start-3 z-10 flex flex-col gap-1.5">
        {isPromo && (
          <span className="bg-brand-rose text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow flex items-center gap-1">
            <Flame size={12} />
            <span>-{discountPercent}%</span>
          </span>
        )}
        {isNew && (
          <span className="bg-brand-teal text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow flex items-center gap-1">
            <Sparkles size={11} />
            <span>{t("common.tagNew")}</span>
          </span>
        )}
        {isBestseller && (
          <span className="bg-brand-yellow text-brand-navy text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full shadow">
            {t("common.tagBestseller")}
          </span>
        )}
      </div>

      {/* Product Image Container with Circle Background effect */}
      <Link
        to={`/product/${product.slug}`}
        className="relative block w-full pt-[95%] overflow-hidden bg-brand-cream/60"
      >
        {/* Subtle decorative yellow circle behind item on hover */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-48 h-48 rounded-full bg-brand-yellow/15 scale-75 group-hover:scale-100 transition-transform duration-500" />
        </div>

        <img
          src={
            product.images?.[0] ||
            "https://images.unsplash.com/photo-1615865417491-9941019fbc00?w=600"
          }
          alt={product.name?.fr}
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-brand-navy/60 backdrop-blur-[2px] flex items-center justify-center p-4">
            <span className="bg-red-600 text-white text-xs font-bold uppercase px-3 py-1.5 rounded-lg shadow">
              {t("product.outOfStock")}
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category or Brand */}
          <div className="flex items-center justify-between text-[11px] text-gray-600 font-bold mb-1">
            <span>{product.category?.name?.fr || "Arts de la table"}</span>
            {isLowStock && !isOutOfStock && (
              <span className="text-amber-700 font-bold text-[10px]">
                {t("product.lowStockWarning", { count: product.stock })}
              </span>
            )}
          </div>

          {/* Product Title */}
          <Link
            to={`/product/${product.slug}`}
            className="block text-sm font-bold text-brand-navy hover:text-brand-rose line-clamp-2 transition-colors"
          >
            {i18n.language === "ar" && product.name?.ar
              ? product.name.ar
              : product.name?.fr}
          </Link>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-base font-extrabold text-brand-rose">
              {formatDZD(currentPrice, i18n.language === "ar")}
            </span>
            {isPromo && (
              <span className="text-xs text-gray-500 line-through">
                {formatDZD(product.price, i18n.language === "ar")}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="w-full bg-brand-cream hover:bg-brand-rose hover:text-white text-brand-navy text-xs font-bold py-2.5 px-2 rounded-xl border border-gray-200 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              title={t("product.addToCart")}
            >
              <ShoppingBag size={14} />
              <span className="hidden sm:inline">{t("product.addToCart")}</span>
            </button>

            <button
              onClick={handleQuickBuy}
              disabled={isOutOfStock}
              className="w-full bg-brand-rose hover:bg-[#b81f42] text-white text-xs font-bold py-2.5 px-2 rounded-xl shadow-md transition-all flex items-center justify-center gap-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Zap size={14} className="fill-current" />
              <span>{i18n.language === "ar" ? "شراء سريع" : "Acheter"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
