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
  Heart,
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

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-6">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-brand-charcoal hover:text-brand-terracotta"
          aria-label="Menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Brand Logo (Refined Serif Aesthetic) */}
        <Link to="/" className="flex items-baseline gap-1.5 group">
          <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-brand-charcoal group-hover:text-brand-terracotta transition-colors">
            Dari&Belle
          </span>
          <span className="font-cursive text-brand-terracotta text-lg sm:text-xl font-normal">
            Tiaret
          </span>
        </Link>

        {/* Center Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-brand-charcoal">
          <Link
            to="/"
            className="hover:text-brand-terracotta transition-colors relative py-1 border-b-2 border-brand-charcoal font-semibold"
          >
            {t("nav.home")}
          </Link>
          <Link
            to="/catalog"
            className="hover:text-brand-terracotta transition-colors py-1 text-gray-600 hover:text-brand-charcoal"
          >
            {t("nav.catalog")}
          </Link>
          <Link
            to="/catalog?category=services-de-table"
            className="hover:text-brand-terracotta transition-colors py-1 text-gray-600 hover:text-brand-charcoal"
          >
            {i18n.language === "ar" ? "المجموعات" : "Collections"}
          </Link>
          <Link
            to="/about"
            className="hover:text-brand-terracotta transition-colors py-1 text-gray-600 hover:text-brand-charcoal"
          >
            {t("nav.about")}
          </Link>
          <Link
            to="/contact"
            className="hover:text-brand-terracotta transition-colors py-1 text-gray-600 hover:text-brand-charcoal"
          >
            {t("nav.contact")}
          </Link>
        </nav>

        {/* Right Action Icons & Shop Now Button */}
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Search Bar / Trigger */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("common.search")}
              className="bg-brand-sand/50 border border-gray-200 rounded-full py-1.5 ps-8 pe-3 text-xs text-brand-charcoal focus:outline-none focus:border-brand-terracotta w-36 focus:w-48 transition-all"
            />
            <Search size={14} className="absolute start-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </form>

          {/* Wishlist / Favorites */}
          <Link
            to="/catalog?tag=bestseller"
            className="text-brand-charcoal hover:text-brand-terracotta transition-colors p-1"
            title="Coups de Cœur"
          >
            <Heart size={20} strokeWidth={1.8} />
          </Link>

          {/* Cart Trigger */}
          <button
            onClick={openCart}
            className="relative text-brand-charcoal hover:text-brand-terracotta transition-colors p-1"
            aria-label="Panier"
          >
            <ShoppingBag size={21} strokeWidth={1.8} />
            {itemsCount > 0 && (
              <span className="absolute -top-1 -end-2 bg-brand-terracotta text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow">
                {itemsCount}
              </span>
            )}
          </button>

          {/* Prominent "Shop Now" / "Commander" Terracotta Button */}
          <Link
            to="/catalog"
            className="hidden sm:inline-flex items-center justify-center bg-brand-terracotta hover:bg-brand-terracottaHover text-white text-xs font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-colors tracking-wide"
          >
            {i18n.language === "ar" ? "تسوق الآن" : "Shop Now"}
          </Link>
        </div>
      </div>

      {/* Sub-bar Category Pills for Quick Access */}
      <div className="hidden lg:block bg-brand-sand/30 border-t border-gray-100/80 py-2">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-[11px] font-medium text-gray-600">
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-none">
            <Link to="/catalog?category=services-de-table" className="hover:text-brand-terracotta transition-colors">
              {i18n.language === "ar" ? "أطقم المائدة والبورسلان" : "Services de Table & Porcelaine"}
            </Link>
            <Link to="/catalog?category=marmites-et-casseroles" className="hover:text-brand-terracotta transition-colors">
              {i18n.language === "ar" ? "القدور وطناجر الجرانيت" : "Marmites & Batteries de Cuisine"}
            </Link>
            <Link to="/catalog?category=menageres-et-couverts" className="hover:text-brand-terracotta transition-colors">
              {i18n.language === "ar" ? "أطقم الملاعق والسكاكين" : "Ménagères & Couverts Dorés"}
            </Link>
            <Link to="/catalog?category=rangement-et-bocaux" className="hover:text-brand-terracotta transition-colors">
              {i18n.language === "ar" ? "برطمانات وتنظيم المطبخ" : "Rangement & Bocaux"}
            </Link>
            <Link to="/catalog?category=verrerie-et-tasses" className="hover:text-brand-terracotta transition-colors">
              {i18n.language === "ar" ? "كؤوس وأطقم الشاي" : "Verrerie & Thé"}
            </Link>
            <Link to="/catalog?category=decoration-et-mobilier" className="hover:text-brand-terracotta transition-colors">
              {i18n.language === "ar" ? "ديكور وأثاث" : "Déco & Mobilier"}
            </Link>
          </div>
          <Link to="/track-order" className="hover:text-brand-terracotta flex items-center gap-1 shrink-0">
            <Truck size={13} />
            <span>{t("nav.trackOrder")}</span>
          </Link>
        </div>
      </div>

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
