import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ShoppingBag,
  Search,
  Phone,
  Truck,
  Menu,
  X,
  User,
  Globe,
} from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import { useUIStore } from "../../store/uiStore";

export const Header = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const itemsCount = useCartStore((state) => state.getItemsCount());
  const openCart = useUIStore((state) => state.openCart);

  const toggleLanguage = () => {
    const newLang = i18n.language === "ar" ? "fr" : "ar";
    i18n.changeLanguage(newLang);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md shadow-sm transition-all">
      {/* Top Notification Bar */}
      <div className="bg-brand-navy text-white text-xs py-2 px-4 border-b border-brand-yellow/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          {/* Slogans & Location */}
          <div className="flex items-center gap-3">
            <span className="bg-brand-rose px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider animate-pulse">
              {i18n.language === "ar" ? "توصيل لـ 58 ولاية" : "Livraison 58 Wilayas"}
            </span>
            <span className="hidden sm:inline font-cursive text-brand-yellow text-sm tracking-wide">
              {t("brand.sloganAr")}
            </span>
            <span className="hidden lg:inline text-gray-300">|</span>
            <span className="hidden lg:inline text-gray-200 italic">
              « {t("brand.sloganFr")} »
            </span>
          </div>

          {/* Contact & Language Switcher */}
          <div className="flex items-center gap-4 text-[11px]">
            <a
              href="tel:0659408403"
              className="flex items-center gap-1.5 hover:text-brand-yellow transition-colors"
            >
              <Phone size={13} className="text-brand-yellow" />
              <span className="font-semibold" dir="ltr">06 59 40 84 03</span>
            </a>
            <span className="text-gray-500">/</span>
            <a
              href="tel:0551007098"
              className="hidden sm:flex items-center gap-1.5 hover:text-brand-yellow transition-colors"
              dir="ltr"
            >
              <span>05 51 00 70 98</span>
            </a>

            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/10 hover:bg-brand-yellow hover:text-brand-navy font-bold transition-all"
              title="Changer la langue / تغيير اللغة"
            >
              <Globe size={13} />
              <span>{i18n.language === "ar" ? "Français" : "العربية"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-brand-navy hover:text-brand-rose"
          aria-label="Menu"
        >
          {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 bg-brand-rose rounded-xl flex items-center justify-center shadow-md shadow-brand-rose/25 group-hover:scale-105 transition-transform overflow-hidden">
            {/* House / Arch silhouette */}
            <div className="w-6 h-7 border-2 border-brand-yellow rounded-t-full flex items-center justify-center">
              <span className="text-white font-serif font-black text-sm">DB</span>
            </div>
            <div className="absolute -bottom-2 -right-2 w-5 h-5 bg-brand-yellow rounded-full opacity-80" />
          </div>

          <div className="flex flex-col">
            <span className="font-serif text-2xl font-bold tracking-tight text-brand-navy leading-none">
              Dari <span className="text-brand-rose font-serif">Belle</span>
            </span>
            <span className="text-[9px] tracking-luxury uppercase font-bold text-brand-yellow font-sans mt-0.5">
              {t("brand.sloganLuxury")}
            </span>
            <span className="text-[9px] text-gray-500 font-medium">Tiaret, Algérie</span>
          </div>
        </Link>

        {/* Search Bar (Desktop) */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-md mx-6 relative"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("common.search")}
            className="w-full bg-brand-cream border border-gray-200 rounded-full py-2.5 ps-10 pe-24 text-sm text-brand-navy focus:outline-none focus:border-brand-rose focus:ring-1 focus:ring-brand-rose transition-all shadow-inner"
          />
          <Search
            size={18}
            className="absolute start-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <button
            type="submit"
            className="absolute end-1.5 top-1/2 -translate-y-1/2 bg-brand-rose hover:bg-[#b81f42] text-white text-xs font-semibold px-4 py-1.5 rounded-full transition-colors"
          >
            {i18n.language === "ar" ? "بحث" : "Chercher"}
          </button>
        </form>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Track order */}
          <Link
            to="/track-order"
            className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-brand-navy hover:text-brand-rose p-2 rounded-lg transition-colors"
            title={t("nav.trackOrder")}
          >
            <Truck size={19} />
            <span className="hidden lg:inline">{t("nav.trackOrder")}</span>
          </Link>

          {/* Admin link */}
          <Link
            to="/admin/login"
            className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-brand-navy p-2 rounded-lg transition-colors"
            title="Espace Gestionnaire"
          >
            <User size={19} />
          </Link>

          {/* Cart Trigger */}
          <button
            onClick={openCart}
            className="relative flex items-center gap-2 bg-brand-rose text-white px-3.5 py-2 rounded-xl shadow-md hover:bg-[#b81f42] transition-all active:scale-95"
            aria-label="Panier"
          >
            <ShoppingBag size={20} />
            <span className="hidden md:inline text-xs font-bold">
              {t("cart.title")}
            </span>
            {itemsCount > 0 && (
              <span className="absolute -top-1.5 -end-1.5 bg-brand-yellow text-brand-navy text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow">
                {itemsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Categories Navigation Bar (Desktop) */}
      <nav className="hidden md:block bg-brand-cream/80 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-brand-navy">
          <div className="flex items-center gap-6 py-2.5 overflow-x-auto scrollbar-none">
            <Link to="/" className="hover:text-brand-rose transition-colors whitespace-nowrap">
              {t("nav.home")}
            </Link>
            <Link to="/catalog" className="hover:text-brand-rose transition-colors whitespace-nowrap">
              {t("nav.catalog")}
            </Link>
            <Link
              to="/catalog?category=services-de-table"
              className="hover:text-brand-rose transition-colors whitespace-nowrap"
            >
              {i18n.language === "ar" ? "أطقم المائدة" : "Services de Table"}
            </Link>
            <Link
              to="/catalog?category=marmites-et-casseroles"
              className="hover:text-brand-rose transition-colors whitespace-nowrap"
            >
              {i18n.language === "ar" ? "القدور والطناجر" : "Marmites & Faitouts"}
            </Link>
            <Link
              to="/catalog?category=menageres-et-couverts"
              className="hover:text-brand-rose transition-colors whitespace-nowrap"
            >
              {i18n.language === "ar" ? "الملاعق والسكاكين" : "Ménagères Royales"}
            </Link>
            <Link
              to="/catalog?category=verrerie-et-tasses"
              className="hover:text-brand-rose transition-colors whitespace-nowrap"
            >
              {i18n.language === "ar" ? "كؤوس وشاي" : "Verrerie & Thé"}
            </Link>
            <Link
              to="/catalog?category=petit-electromenager"
              className="hover:text-brand-rose transition-colors whitespace-nowrap"
            >
              {i18n.language === "ar" ? "كهرومنزلية" : "Électroménager"}
            </Link>
          </div>

          <div className="flex items-center gap-4 py-2 text-xs">
            <Link
              to="/about"
              className="text-gray-500 hover:text-brand-navy transition-colors whitespace-nowrap"
            >
              {t("nav.about")}
            </Link>
            <Link
              to="/contact"
              className="text-brand-rose font-bold hover:underline whitespace-nowrap"
            >
              {t("nav.contact")}
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-4 shadow-xl animate-in slide-in-from-top duration-200">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("common.search")}
              className="w-full bg-brand-cream border border-gray-200 rounded-xl py-2.5 ps-10 pe-4 text-sm"
            />
            <Search size={18} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          </form>

          <div className="flex flex-col space-y-2.5 text-sm font-medium text-brand-navy">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 border-b border-gray-50 hover:text-brand-rose"
            >
              {t("nav.home")}
            </Link>
            <Link
              to="/catalog"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 border-b border-gray-50 hover:text-brand-rose"
            >
              {t("nav.catalog")}
            </Link>
            <Link
              to="/catalog?category=services-de-table"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 border-b border-gray-50 hover:text-brand-rose"
            >
              {i18n.language === "ar" ? "أطقم المائدة والبورسلان" : "Services de Table & Porcelaine"}
            </Link>
            <Link
              to="/catalog?category=marmites-et-casseroles"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 border-b border-gray-50 hover:text-brand-rose"
            >
              {i18n.language === "ar" ? "القدور والطناجر الفاخرة" : "Marmites & Casseroles"}
            </Link>
            <Link
              to="/catalog?category=menageres-et-couverts"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 border-b border-gray-50 hover:text-brand-rose"
            >
              {i18n.language === "ar" ? "الملاعق والكؤوس الذهبية" : "Ménagères & Couverts Dorés"}
            </Link>
            <Link
              to="/track-order"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 border-b border-gray-50 hover:text-brand-rose flex items-center gap-2"
            >
              <Truck size={16} />
              <span>{t("nav.trackOrder")}</span>
            </Link>
            <Link
              to="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 hover:text-brand-rose text-brand-rose font-bold"
            >
              {t("nav.contact")} (Tiaret)
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
