import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { api } from "../../api/endpoints";

export const CategoryShowcase = () => {
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.getCategories();
        if (res.data.data) {
          setCategories(res.data.data);
        }
      } catch (e) {
        console.error("Error fetching categories:", e);
      }
    };
    fetchCategories();
  }, []);

  return (
    <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* 1. Duo Featured Collection Cards (matching the mockup: Living Room Collections & Kitchen Essentials) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {/* Card 1: Arts de la Table */}
        <div className="bg-[#F5EFE6] rounded-3xl p-6 sm:p-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-6 border border-[#EAE4DC] hover:shadow-md transition-shadow group">
          <div className="space-y-3 sm:max-w-[220px] text-center sm:text-start">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1F1E1D] leading-tight">
              {i18n.language === "ar" ? (
                <span>أطقم <span className="text-[#9E532B] font-serif italic">المائدة</span> الفاخرة</span>
              ) : (
                <span>Arts de la <span className="text-[#9E532B] font-serif italic">Table</span></span>
              )}
            </h3>
            <p className="text-xs sm:text-sm text-[#6E6B67] leading-relaxed">
              {i18n.language === "ar"
                ? "تشكيلات بورسلان وسيراميك راقية تليق بضيوفك."
                : "Grès artisanal, porcelaine fine & design intemporel."}
            </p>
            <Link
              to="/catalog?category=services-de-table"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1F1E1D] hover:text-[#9E532B] transition-colors pt-2 border-b border-current pb-0.5"
            >
              <span>{i18n.language === "ar" ? "تسوق الآن" : "Shop Now"}</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="w-44 h-40 sm:w-56 sm:h-48 shrink-0 overflow-hidden rounded-2xl">
            <img
              src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&auto=format&fit=crop"
              alt="Arts de la Table"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-2xl"
            />
          </div>
        </div>

        {/* Card 2: Kitchen Essentials */}
        <div className="bg-[#F5EFE6] rounded-3xl p-6 sm:p-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-6 border border-[#EAE4DC] hover:shadow-md transition-shadow group">
          <div className="space-y-3 sm:max-w-[220px] text-center sm:text-start">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1F1E1D] leading-tight">
              {i18n.language === "ar" ? (
                <span>مستلزمات <span className="text-[#9E532B] font-serif italic">الطهي</span></span>
              ) : (
                <span>Kitchen <span className="text-[#9E532B] font-serif italic">Essentials</span></span>
              )}
            </h3>
            <p className="text-xs sm:text-sm text-[#6E6B67] leading-relaxed">
              {i18n.language === "ar"
                ? "قدور جرانيت، كوكوت وإينوكس أصلي مصنوع ليدوم."
                : "Cocottes fonte, batteries granite & bocaux faits pour le quotidien."}
            </p>
            <Link
              to="/catalog?category=marmites-et-casseroles"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1F1E1D] hover:text-[#9E532B] transition-colors pt-2 border-b border-current pb-0.5"
            >
              <span>{i18n.language === "ar" ? "تسوق الآن" : "Shop Now"}</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="w-44 h-40 sm:w-56 sm:h-48 shrink-0 overflow-hidden rounded-2xl">
            <img
              src="https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=600&auto=format&fit=crop"
              alt="Kitchen Essentials"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-2xl"
            />
          </div>
        </div>
      </div>

      {/* 2. All Categories Grid */}
      {categories.length > 0 && (
        <div className="pt-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-serif font-bold text-[#1F1E1D]">
              {i18n.language === "ar" ? "تصفح حسب الفئات" : "Explorer par Catégories"}
            </h3>
            <Link
              to="/catalog"
              className="text-xs font-semibold text-[#9E532B] hover:underline"
            >
              {i18n.language === "ar" ? "عرض الكل ←" : "Tout voir →"}
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/catalog?category=${cat.slug}`}
                className="group flex flex-col items-center text-center p-3.5 rounded-2xl bg-white border border-[#EAE4DC] hover:border-[#9E532B]/40 hover:shadow-md transition-all duration-300"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-3 bg-[#FAF7F2] p-1 border border-[#EAE4DC] group-hover:border-[#9E532B] transition-colors">
                  <img
                    src={cat.image}
                    alt={cat.name?.fr}
                    className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h4 className="text-xs font-bold text-[#1F1E1D] group-hover:text-[#9E532B] transition-colors line-clamp-2">
                  {i18n.language === "ar" && cat.name?.ar ? cat.name.ar : cat.name?.fr}
                </h4>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};