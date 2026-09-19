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
        const params = { limit: 8 };
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
    <section className="py-16 px-4 bg-brand-cream/60">
      <div className="max-w-7xl mx-auto">
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
          <div>
            <span className="text-xs uppercase tracking-luxury font-black text-brand-rose block">
              DARI BELLE TIARET
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-brand-navy">
              {t("home.featuredTitle")}
            </h2>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              {t("home.featuredSubtitle")}
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "all"
                  ? "bg-brand-rose text-white shadow"
                  : "text-gray-600 hover:text-brand-navy"
              }`}
            >
              {i18n.language === "ar" ? "الكل" : "Tous"}
            </button>

            <button
              onClick={() => setActiveTab("bestseller")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "bestseller"
                  ? "bg-brand-yellow text-brand-navy shadow"
                  : "text-gray-600 hover:text-brand-navy"
              }`}
            >
              <Trophy size={14} />
              <span>{t("home.tabBestsellers")}</span>
            </button>

            <button
              onClick={() => setActiveTab("promo")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "promo"
                  ? "bg-brand-rose text-white shadow"
                  : "text-gray-600 hover:text-brand-navy"
              }`}
            >
              <Flame size={14} />
              <span>{t("home.tabPromos")}</span>
            </button>

            <button
              onClick={() => setActiveTab("new")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "new"
                  ? "bg-brand-teal text-white shadow"
                  : "text-gray-600 hover:text-brand-navy"
              }`}
            >
              <Sparkles size={14} />
              <span>{t("home.tabNew")}</span>
            </button>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-80 bg-white rounded-2xl border border-gray-100 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* View all button */}
        <div className="mt-12 text-center">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 bg-brand-navy hover:bg-brand-darkNavy text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            <span>{t("home.viewAll")}</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};
