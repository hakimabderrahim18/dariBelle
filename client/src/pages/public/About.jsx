import React from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { Sparkles, MapPin, Heart, Award, ShieldCheck } from "lucide-react";
import { WaveDivider } from "../../components/ui/WaveDivider";

export const About = () => {
  const { t, i18n } = useTranslation();

  return (
    <>
      <Helmet>
        <title>Notre Histoire | Dari Belle Tiaret</title>
      </Helmet>

      {/* Hero */}
      <div className="bg-brand-navy text-white py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-3 relative z-10">
          <span className="text-xs uppercase tracking-luxury text-brand-yellow font-bold">
            {t("brand.sloganLuxury")}
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold">
            {i18n.language === "ar" ? "قصة متجر داري بيل" : "L'Histoire Dari Belle"}
          </h1>
          <p className="font-cursive text-brand-yellow text-3xl">
            « {t("brand.sloganAr")} »
          </p>
        </div>
      </div>
      <WaveDivider color="#1B1F4A" className="text-brand-navy -translate-y-1" flip />

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
        <div className="prose prose-lg text-gray-700 leading-relaxed space-y-6">
          <h2 className="text-2xl font-serif font-bold text-brand-navy">
            {i18n.language === "ar"
              ? "الجمال له عنوان واحد في عاصمة الرستميين تيارت"
              : "L'art de recevoir et la beauté des tables algériennes"}
          </h2>
          <p>
            Fondé à Tiaret, <strong>Dari Belle</strong> est né d'une passion inconditionnelle pour l'élégance du foyer et les traditions d'accueil et d'hospitalité qui caractérisent la famille algérienne.
          </p>
          <p>
            Que ce soit pour préparer le trousseau d'une future mariée (Tasdira), accueillir les fêtes de l'Aïd, célébrer un heureux événement ou simplement sublimer le repas quotidien familial, nos collections de vaisselle en porcelaine fine, nos casseroles granite et nos services à café sculptés incarnent l'excellence et le luxe accessible.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm space-y-3 text-center">
            <div className="w-12 h-12 rounded-xl bg-brand-rose/10 text-brand-rose flex items-center justify-center mx-auto">
              <Award size={24} />
            </div>
            <h3 className="font-serif font-bold text-base text-brand-navy">Qualité Certifiée</h3>
            <p className="text-xs text-gray-500">
              Des matériaux nobles : Inox chirurgical 18/10, granit allemand multicouche et porcelaine haute résistance.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm space-y-3 text-center">
            <div className="w-12 h-12 rounded-xl bg-brand-yellow/15 text-brand-navy flex items-center justify-center mx-auto">
              <MapPin size={24} />
            </div>
            <h3 className="font-serif font-bold text-base text-brand-navy">Ancrage à Tiaret</h3>
            <p className="text-xs text-gray-500">
              Un showroom chaleureux situé Route Lacadémie, à côté du Printemps, ouvert 7 jours sur 7.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm space-y-3 text-center">
            <div className="w-12 h-12 rounded-xl bg-brand-teal/10 text-brand-teal flex items-center justify-center mx-auto">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-serif font-bold text-base text-brand-navy">Garantie & Sérénité</h3>
            <p className="text-xs text-gray-500">
              Livraison sécurisée dans les 58 Wilayas d'Algérie avec emballage anti-choc et paiement à la livraison.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
