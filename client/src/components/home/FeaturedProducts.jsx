import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Flame, Sparkles, Trophy } from "lucide-react";
import { ProductCard } from "../product/ProductCard";
import { api } from "../../api/endpoints";

export const FeaturedProducts = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("all");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = { limit: 10 };
        if (activeTab === "new") params.tag = "new";
        else if (activeTab === "bestseller") params.tag = "bestseller";
        else if (activeTab === "promo") params.tag = "promo";

        const res = await api.getProducts(params);
        if (res.data.data) {
          setProducts(res.data.data);
        }
      } catch (e) {
        console.error("Error fetching featured products:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [activeTab]);

  return (
    <section className="py-14 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* 1. Centered Header (matching "Trending Finds" in mockup) */}
      <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#1F1E1D]">
          {i18n.language === "ar" ? "أرقى المختارات والترند" : "Trending Finds"}
        </h2>
        <p className="text-xs sm:text-sm text-[#6E6B67]">
          {i18n.language === "ar"
            ? "قطع مختارة بعناية للمطبخ والمنزل تنال إعجاب العائلات حالياً."
            : "Handpicked tableware & kitchen pieces everyone loves right now."}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-center gap-2 mb-10 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            activeTab === "all"
              ? "bg-[#1F1E1D] text-white shadow-xs"
              : "bg-[#F5EFE6] text-[#6E6B67] hover:text-[#1F1E1D]"
          }`}
        >
          {i18n.language === "ar" ? "جميع المنتجات" : "Tous"}
        </button>

        <button
          onClick={() => setActiveTab("bestseller")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            activeTab === "bestseller"
              ? "bg-[#9E532B] text-white shadow-xs"
              : "bg-[#F5EFE6] text-[#6E6B67] hover:text-[#1F1E1D]"
          }`}
        >
          <Trophy size={13} />
          <span>{i18n.language === "ar" ? "الأكثر طلباً" : "Bestsellers"}</span>
        </button>

        <button
          onClick={() => setActiveTab("promo")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            activeTab === "promo"
              ? "bg-[#9E532B] text-white shadow-xs"
              : "bg-[#F5EFE6] text-[#6E6B67] hover:text-[#1F1E1D]"
          }`}
        >
          <Flame size={13} />
          <span>{i18n.language === "ar" ? "تخفيضات" : "Promotions"}</span>
        </button>

        <button
          onClick={() => setActiveTab("new")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
            activeTab === "new"
              ? "bg-[#5A7365] text-white shadow-xs"
              : "bg-[#F5EFE6] text-[#6E6B67] hover:text-[#1F1E1D]"
          }`}
        >
          <Sparkles size={13} />
          <span>{i18n.language === "ar" ? "وصل حديثاً" : "Nouveautés"}</span>
        </button>
      </div>

      {/* Product Grid: 5 items per row on large screens matching the mockup */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-[#F5EFE6]/60 rounded-2xl aspect-[3/4] animate-pulse"
            />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 text-sm">
          {t("catalog.noProducts")}
        </div>
      )}

      {/* 2. Limited Time Offer Promo Banner (matching mockup with arched visual and arrow) */}
      <div className="mt-16 sm:mt-20 bg-[#F7EFE5] rounded-3xl p-6 sm:p-10 lg:p-12 border border-[#EAE4DC] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        {/* Background organic curves */}
        <div className="absolute end-0 top-0 w-80 h-80 rounded-full bg-[#EDE6DB]/40 -translate-y-12 translate-x-12 pointer-events-none" />

        {/* Left copy & CTA */}
        <div className="space-y-4 max-w-md text-center md:text-start relative z-10">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#9E532B]">
            {i18n.language === "ar" ? "عرض لفترة محدودة" : "Limited Time Offer"}
          </span>

          <h3 className="text-3xl sm:text-4xl font-serif font-bold text-[#1F1E1D] leading-tight">
            {i18n.language === "ar" ? (
              <span>
                تخفيض يصل حتى{" "}
                <span className="font-serif italic text-[#9E532B]">40%</span> على تشكيلة الصالون والمطبخ
              </span>
            ) : (
              <span>
                Up to <span className="font-serif italic text-[#9E532B]">40% Off</span> on Bestsellers
              </span>
            )}
          </h3>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
            <Link
              to="/catalog?tag=promo"
              className="bg-[#9E532B] hover:bg-[#85401B] text-white text-xs font-semibold px-7 py-3 rounded-lg shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {i18n.language === "ar" ? "استفد من العرض الآن" : "Grab the Deal"}
            </Link>

            {/* Hand-drawn style decorative arrow */}
            <svg
              className="w-16 h-8 text-[#9E532B] hidden sm:block rtl:scale-x-[-1]"
              viewBox="0 0 64 32"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M4 22 C 20 28, 40 24, 58 10" />
              <path d="M50 8 L 58 10 L 56 18" />
            </svg>
          </div>
        </div>

        {/* Right visual matching the mockup banner */}
        <div className="w-full md:w-1/2 max-w-md rounded-2xl overflow-hidden shadow-md relative z-10 border border-[#EAE4DC] bg-white p-2">
          <img
            src="https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800&auto=format&fit=crop"
            alt="Limited Time Offer"
            className="w-full h-56 sm:h-64 object-cover rounded-xl"
          />
        </div>
      </div>
    </section>
  );
};