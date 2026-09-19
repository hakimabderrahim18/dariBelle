import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { Filter, SlidersHorizontal, ArrowUpDown, X, Search } from "lucide-react";
import { ProductCard } from "../../components/product/ProductCard";
import { Button } from "../../components/ui/Button";
import { api } from "../../api/endpoints";

export const Catalog = () => {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter state
  const currentCategory = searchParams.get("category") || "";
  const currentTag = searchParams.get("tag") || "";
  const currentSearch = searchParams.get("search") || "";
  const currentSort = searchParams.get("sort") || "newest";
  const currentPage = parseInt(searchParams.get("page") || "1");
  const inStockOnly = searchParams.get("inStock") === "true";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.getCategories();
        if (res.data.data) setCategories(res.data.data);
      } catch (e) {
        console.error("Error fetching categories:", e);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          limit: 12,
          sort: currentSort,
        };
        if (currentCategory) params.category = currentCategory;
        if (currentTag) params.tag = currentTag;
        if (currentSearch) params.search = currentSearch;
        if (inStockOnly) params.inStock = "true";

        const res = await api.getProducts(params);
        if (res.data.data) {
          setProducts(res.data.data);
          setTotalProducts(res.data.meta?.total || 0);
          setTotalPages(res.data.meta?.pages || 1);
        }
      } catch (e) {
        console.error("Error fetching products:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentCategory, currentTag, currentSearch, currentSort, currentPage, inStockOnly]);

  const updateParam = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }
    nextParams.set("page", "1");
    setSearchParams(nextParams);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  return (
    <>
      <Helmet>
        <title>Boutique & Collections | Dari Belle Tiaret</title>
        <meta
          name="description"
          content="Découvrez notre sélection exclusive d'arts de la table, vaisselle de luxe et marmites granite à Tiaret."
        />
      </Helmet>

      <div className="bg-brand-cream/40 py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs uppercase tracking-luxury font-black text-brand-rose">
              {t("brand.sloganLuxury")}
            </span>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy">
              {t("catalog.title")}
            </h1>
            <p className="text-xs md:text-sm text-gray-500">
              {t("home.featuredSubtitle")}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-brand-navy shadow-sm"
            >
              <SlidersHorizontal size={15} />
              <span>{t("catalog.filterTitle")}</span>
            </button>

            <span className="text-xs text-gray-500 font-medium">
              {t("catalog.showing")}{" "}
              <strong className="text-brand-navy">{products.length}</strong>{" "}
              {t("catalog.of")}{" "}
              <strong className="text-brand-navy">{totalProducts}</strong>{" "}
              {t("catalog.results")}
            </span>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <ArrowUpDown size={15} className="text-gray-400 shrink-0" />
            <select
              value={currentSort}
              onChange={(e) => updateParam("sort", e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-brand-navy focus:border-brand-rose focus:ring-1 focus:ring-brand-rose outline-none"
            >
              <option value="newest">{t("catalog.sortNewest")}</option>
              <option value="popular">{t("catalog.sortPopular")}</option>
              <option value="price-asc">{t("catalog.sortPriceAsc")}</option>
              <option value="price-desc">{t("catalog.sortPriceDesc")}</option>
            </select>
          </div>
        </div>

        {/* Layout: Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-serif font-bold text-base text-brand-navy">
                  {t("catalog.filterTitle")}
                </h3>
                {(currentCategory || currentTag || currentSearch || inStockOnly) && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-brand-rose font-bold hover:underline"
                  >
                    {t("catalog.clearFilters")}
                  </button>
                )}
              </div>

              {/* Categories Filter */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-navy mb-3">
                  {t("catalog.category")}
                </h4>
                <div className="space-y-1.5 text-xs">
                  <button
                    onClick={() => updateParam("category", "")}
                    className={`block w-full text-start px-2 py-1.5 rounded-lg transition-colors ${
                      !currentCategory
                        ? "bg-brand-rose text-white font-bold"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {t("catalog.allCategories")}
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => updateParam("category", cat.slug)}
                      className={`block w-full text-start px-2 py-1.5 rounded-lg transition-colors ${
                        currentCategory === cat.slug
                          ? "bg-brand-rose text-white font-bold"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {i18n.language === "ar" && cat.name?.ar
                        ? cat.name.ar
                        : cat.name?.fr}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags Filter */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-navy mb-3">
                  Offres & Collections
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() =>
                      updateParam("tag", currentTag === "promo" ? "" : "promo")
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      currentTag === "promo"
                        ? "bg-brand-rose text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {t("common.tagPromo")}
                  </button>

                  <button
                    onClick={() =>
                      updateParam("tag", currentTag === "bestseller" ? "" : "bestseller")
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      currentTag === "bestseller"
                        ? "bg-brand-yellow text-brand-navy"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {t("common.tagBestseller")}
                  </button>

                  <button
                    onClick={() =>
                      updateParam("tag", currentTag === "new" ? "" : "new")
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      currentTag === "new"
                        ? "bg-brand-teal text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {t("common.tagNew")}
                  </button>
                </div>
              </div>

              {/* Stock only checkbox */}
              <div className="pt-3 border-t">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-brand-navy">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => updateParam("inStock", e.target.checked ? "true" : "")}
                    className="w-4 h-4 rounded text-brand-rose focus:ring-brand-rose"
                  />
                  <span>{t("catalog.inStockOnly")}</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className="h-80 bg-white rounded-2xl border border-gray-100 animate-pulse"
                  />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-2xl border border-gray-100 p-8 space-y-4">
                <Search size={40} className="text-gray-300 mx-auto" />
                <h3 className="text-lg font-bold text-brand-navy font-serif">
                  {t("catalog.noProducts")}
                </h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Essayez d'ajuster vos critères ou de réinitialiser les filtres pour découvrir l'ensemble de notre catalogue.
                </p>
                <Button variant="primary" size="md" onClick={clearAllFilters}>
                  {t("catalog.clearFilters")}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => updateParam("page", page.toString())}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                      currentPage === page
                        ? "bg-brand-rose text-white shadow-md"
                        : "bg-white border border-gray-200 text-brand-navy hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative ms-auto w-full max-w-xs bg-white h-full p-6 overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="font-serif font-bold text-lg text-brand-navy">
                {t("catalog.filterTitle")}
              </h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-2 text-gray-400 hover:text-brand-navy"
              >
                <X size={20} />
              </button>
            </div>

            {/* Mobile Categories */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-navy mb-3">
                {t("catalog.category")}
              </h4>
              <div className="space-y-2 text-xs">
                <button
                  onClick={() => {
                    updateParam("category", "");
                    setIsMobileFilterOpen(false);
                  }}
                  className={`block w-full text-start px-3 py-2 rounded-lg ${
                    !currentCategory ? "bg-brand-rose text-white font-bold" : "text-gray-600"
                  }`}
                >
                  {t("catalog.allCategories")}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => {
                      updateParam("category", cat.slug);
                      setIsMobileFilterOpen(false);
                    }}
                    className={`block w-full text-start px-3 py-2 rounded-lg ${
                      currentCategory === cat.slug
                        ? "bg-brand-rose text-white font-bold"
                        : "text-gray-600"
                    }`}
                  >
                    {i18n.language === "ar" && cat.name?.ar ? cat.name.ar : cat.name?.fr}
                  </button>
                ))}
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => setIsMobileFilterOpen(false)}
            >
              Appliquer les filtres
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
