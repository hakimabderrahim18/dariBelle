import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Home, Grid, ShoppingBag, Truck, Phone } from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import { useUIStore } from "../../store/uiStore";

export const MobileNav = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const itemsCount = useCartStore((state) => state.getItemsCount());
  const openCart = useUIStore((state) => state.openCart);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-40 py-2 px-3 shadow-lg">
      <div className="flex items-center justify-around">
        <Link
          to="/"
          className={`flex flex-col items-center gap-1 py-1 text-[11px] font-medium transition-colors ${
            isActive("/") ? "text-brand-rose font-bold" : "text-gray-500 hover:text-brand-navy"
          }`}
        >
          <Home size={19} />
          <span>{t("nav.home")}</span>
        </Link>

        <Link
          to="/catalog"
          className={`flex flex-col items-center gap-1 py-1 text-[11px] font-medium transition-colors ${
            isActive("/catalog") ? "text-brand-rose font-bold" : "text-gray-500 hover:text-brand-navy"
          }`}
        >
          <Grid size={19} />
          <span>{t("nav.catalog")}</span>
        </Link>

        <button
          onClick={openCart}
          className="relative flex flex-col items-center gap-1 py-1 text-[11px] font-medium text-gray-500 hover:text-brand-navy transition-colors"
        >
          <div className="relative">
            <ShoppingBag size={19} />
            {itemsCount > 0 && (
              <span className="absolute -top-1.5 -end-2 bg-brand-rose text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {itemsCount}
              </span>
            )}
          </div>
          <span>{t("cart.title")}</span>
        </button>

        <Link
          to="/track-order"
          className={`flex flex-col items-center gap-1 py-1 text-[11px] font-medium transition-colors ${
            isActive("/track-order") ? "text-brand-rose font-bold" : "text-gray-500 hover:text-brand-navy"
          }`}
        >
          <Truck size={19} />
          <span>{i18n.language === "ar" ? "تتبع" : "Suivi"}</span>
        </Link>

        <a
          href="https://wa.me/213659408403"
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center gap-1 py-1 text-[11px] font-medium text-emerald-600 hover:text-emerald-700"
        >
          <Phone size={19} />
          <span>WhatsApp</span>
        </a>
      </div>
    </nav>
  );
};
