import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowUpRight } from "lucide-react";
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

  if (categories.length === 0) return null;

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
        <span className="text-xs uppercase tracking-luxury font-black text-brand-rose">
          {t("brand.sloganLuxury")}
        </span>
        <h2 className="text-2xl md:text-4xl font-serif font-bold text-brand-navy">
          {t("home.categoriesTitle")}
        </h2>
        <p className="text-sm text-gray-500">
          {t("home.categoriesSubtitle")}
        </p>
        <div className="w-16 h-1 bg-brand-yellow mx-auto rounded-full mt-3" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
        {categories.map((cat) => (
          <Link
            key={cat._id}
            to={`/catalog?category=${cat.slug}`}
            className="group flex flex-col items-center text-center p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
          >
            {/* Top house shape / arch silhouette frame */}
            <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full p-1 bg-gradient-to-tr from-brand-yellow via-brand-rose to-brand-teal mb-3 group-hover:scale-105 transition-transform duration-300 shadow">
              <div className="w-full h-full rounded-full overflow-hidden bg-brand-cream">
                <img
                  src={
                    cat.image ||
                    "https://images.unsplash.com/photo-1615865417491-9941019fbc00?w=300"
                  }
                  alt={cat.name?.fr}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>

            <h3 className="text-xs md:text-sm font-bold text-brand-navy group-hover:text-brand-rose transition-colors line-clamp-2">
              {i18n.language === "ar" && cat.name?.ar
                ? cat.name.ar
                : cat.name?.fr}
            </h3>

            <div className="mt-2 text-[11px] font-semibold text-brand-teal flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <span>{i18n.language === "ar" ? "تصفح" : "Voir"}</span>
              <ArrowUpRight size={13} />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
