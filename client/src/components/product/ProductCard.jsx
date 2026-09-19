import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ShoppingBag, Heart, Star, Zap, Flame, Sparkles } from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import { useUIStore } from "../../store/uiStore";
import { formatDZD } from "../../utils/formatters";
import toast from "react-hot-toast";

export const ProductCard = ({ product }) => {
  const { t, i18n } = useTranslation();
  const [isFavorite, setIsFavorite] = useState(false);
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

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    toast.success(
      !isFavorite
        ? (i18n.language === "ar" ? "أضيف إلى المفضلة" : "Ajouté aux favoris")
        : (i18n.language === "ar" ? "أزيل من المفضلة" : "Retiré des favoris")
    );
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-[#EAE4DC] hover:border-[#9E532B]/30 hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden p-3">
      {/* Product Image Container */}
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#FAF7F2] flex items-center justify-center">
        {/* Badges Overlay */}
        <div className="absolute top-2 start-2 z-10 flex flex-col gap-1">
          {isPromo && (
            <span className="bg-[#9E532B] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              -{discountPercent}%
            </span>
          )}
          {isNew && (
            <span className="bg-[#5A7365] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
              {t("common.tagNew")}
            </span>
          )}
        </div>

        {/* Wishlist Heart Button (Top Right, matching mockup) */}
        <button
          onClick={toggleFavorite}
          className="absolute top-2 end-2 z-10 w-7 h-7 rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-[#9E532B] flex items-center justify-center shadow-xs transition-colors"
          aria-label="Favoris"
        >
          <Heart
            size={14}
            className={isFavorite ? "fill-[#9E532B] text-[#9E532B]" : ""}
          />
        </button>

        {/* Product Image */}
        <Link to={`/product/${product.slug}`} className="w-full h-full block">
          <img
            src={
              product.images?.[0] ||
              "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600"
            }
            alt={product.name?.fr}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 rounded-xl"
            loading="lazy"
          />

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-2 rounded-xl">
              <span className="bg-red-600 text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-md shadow">
                {t("product.outOfStock")}
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Content */}
      <div className="pt-3 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <Link
            to={`/product/${product.slug}`}
            className="block text-xs sm:text-sm font-semibold text-[#1F1E1D] group-hover:text-[#9E532B] line-clamp-1 transition-colors"
          >
            {i18n.language === "ar" && product.name?.ar
              ? product.name.ar
              : product.name?.fr}
          </Link>

          {/* 5 Rating Stars (matching the mockup design) */}
          <div className="flex items-center gap-0.5 mt-1 text-[#D4A373]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={11} className="fill-[#D4A373] text-[#D4A373]" />
            ))}
          </div>
        </div>

        {/* Pricing & CTA Buttons */}
        <div className="mt-3 pt-2 border-t border-[#F5EFE6] flex items-center justify-between gap-2">
          {/* Price */}
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-bold text-[#1F1E1D]">
              {formatDZD(currentPrice, i18n.language === "ar")}
            </span>
            {isPromo && (
              <span className="text-[10px] text-gray-400 line-through">
                {formatDZD(product.price, i18n.language === "ar")}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="p-2 rounded-lg bg-[#F5EFE6] hover:bg-[#9E532B] text-[#1F1E1D] hover:text-white transition-colors disabled:opacity-50"
              title={t("product.addToCart")}
            >
              <ShoppingBag size={14} />
            </button>

            <button
              onClick={handleQuickBuy}
              disabled={isOutOfStock}
              className="bg-[#9E532B] hover:bg-[#85401B] text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-colors shadow-xs active:scale-95 disabled:opacity-50 hidden sm:inline-flex items-center gap-1"
            >
              <Zap size={12} className="fill-current" />
              <span>{i18n.language === "ar" ? "شراء" : "Acheter"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};