import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, ShieldCheck, Heart } from "lucide-react";
import { WaveDivider } from "../ui/WaveDivider";

export const Footer = () => {
  const { t, i18n } = useTranslation();

  return (
    <footer className="relative bg-brand-navy text-white mt-16 pt-0">
      {/* Decorative Wave Divider at Top */}
      <WaveDivider color="#1B1F4A" className="text-brand-navy -translate-y-[99%]" />

      <div className="max-w-7xl mx-auto px-4 pt-8 pb-16">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-rose rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-serif font-black text-base">DB</span>
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold tracking-tight">
                  Dari <span className="text-brand-rose">Belle</span>
                </h3>
                <p className="text-[10px] tracking-luxury uppercase text-brand-yellow font-bold">
                  {t("brand.sloganLuxury")}
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed">
              {i18n.language === "ar"
                ? "داري بيل تيارت: عنوان الأناقة والفخامة في عالم الأواني وأطقم المائدة الراقية. نوفر لكم أفضل الماركات العالمية بتوصيل مضمون لكافة ولايات الوطن."
                : "Dari Belle Tiaret : Votre destination prestigieuse pour les arts de la table, vaisselle d'exception et équipements de cuisine de luxe. Livraison sécurisée dans les 58 Wilayas."}
            </p>

            <div className="pt-2">
              <span className="font-cursive text-brand-yellow text-xl block">
                « {t("brand.sloganAr")} »
              </span>
              <span className="text-xs text-gray-300 italic block mt-0.5">
                « {t("brand.sloganFr")} »
              </span>
            </div>
          </div>

          {/* Col 2: Store Coordinates Tiaret */}
          <div className="space-y-4">
            <h4 className="text-base font-bold font-serif uppercase tracking-wider text-brand-yellow">
              {i18n.language === "ar" ? "متجرنا في تيارت" : "Boutique à Tiaret"}
            </h4>

            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-2.5">
                <MapPin size={18} className="text-brand-rose shrink-0 mt-0.5" />
                <span>Route Lacadémie, à côté du Printemps, Tiaret – Algérie</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={18} className="text-brand-yellow shrink-0" />
                <div className="flex flex-col" dir="ltr">
                  <a href="tel:0659408403" className="hover:text-white transition-colors">
                    06 59 40 84 03
                  </a>
                  <a href="tel:0551007098" className="hover:text-white transition-colors">
                    05 51 00 70 98
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={18} className="text-brand-teal shrink-0" />
                <a href="mailto:contact@daribelle-dz.com" className="hover:text-white transition-colors">
                  contact@daribelle-dz.com
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock size={18} className="text-brand-yellow shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400">
                    {i18n.language === "ar"
                      ? "السبت - الخميس: 09:00 - 19:30 | الجمعة: 14:30 - 20:00"
                      : "Samedi - Jeudi : 09h00 - 19h30 | Vendredi : 14h30 - 20h00"}
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-base font-bold font-serif uppercase tracking-wider text-brand-yellow">
              {i18n.language === "ar" ? "روابط سريعة" : "Navigation"}
            </h4>

            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link to="/catalog" className="hover:text-brand-yellow transition-colors">
                  {t("nav.catalog")}
                </Link>
              </li>
              <li>
                <Link to="/catalog?tag=new" className="hover:text-brand-yellow transition-colors">
                  {t("home.tabNew")}
                </Link>
              </li>
              <li>
                <Link to="/catalog?tag=promo" className="hover:text-brand-yellow transition-colors">
                  {t("home.tabPromos")}
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="hover:text-brand-yellow transition-colors">
                  {t("nav.trackOrder")}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-brand-yellow transition-colors">
                  {t("nav.about")}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand-yellow transition-colors">
                  {t("nav.contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Social Media */}
          <div className="space-y-4">
            <h4 className="text-base font-bold font-serif uppercase tracking-wider text-brand-yellow">
              {i18n.language === "ar" ? "ضمانات الشراء" : "Engagements"}
            </h4>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs text-gray-300">
              <div className="flex items-center gap-2 text-brand-teal font-semibold">
                <ShieldCheck size={16} />
                <span>Paiement à la livraison 58 Wilayas</span>
              </div>
              <p className="text-[11px] text-gray-400">
                Vous vérifiez votre colis avant de régler directement au livreur.
              </p>
            </div>

            <div className="pt-2">
              <h5 className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-3">
                {i18n.language === "ar" ? "تابعونا على شبكات التواصل" : "Rejoignez notre communauté"}
              </h5>
              <div className="flex items-center gap-3">
                <a
                  href="https://instagram.com/daribelle.tiaret"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-brand-rose flex items-center justify-center transition-colors"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href="https://facebook.com/daribelle.tiaret"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-blue-600 flex items-center justify-center transition-colors"
                >
                  <Facebook size={18} />
                </a>
                <a
                  href="https://wa.me/213659408403"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-emerald-600 flex items-center justify-center transition-colors"
                >
                  <Phone size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} Dari Belle. Tous droits réservés. Tiaret, Algérie.</p>
          <div className="flex items-center gap-1 text-gray-400">
            <span>Fait avec passion pour l'art de vivre algérien</span>
            <Heart size={13} className="text-brand-rose fill-brand-rose" />
          </div>
        </div>
      </div>
    </footer>
  );
};
