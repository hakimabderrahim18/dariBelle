import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MapPin, Phone, Sparkles } from "lucide-react";
import { WaveDivider } from "../ui/WaveDivider";

export const BrandStory = () => {
  const { t, i18n } = useTranslation();

  return (
    <section className="relative bg-brand-navy text-white py-20 overflow-hidden">
      {/* Wave top */}
      <WaveDivider color="#1B1F4A" className="absolute top-0 inset-x-0 -translate-y-[95%]" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Text */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-yellow text-xs font-bold uppercase tracking-wider">
              <Sparkles size={14} />
              <span>{t("brand.sloganLuxury")}</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-serif font-bold leading-tight">
              {i18n.language === "ar" ? (
                <>
                  <span className="text-brand-yellow font-cursive text-5xl md:text-6xl block mb-2">
                    « عمري دارك معانا »
                  </span>
                  الجمال والفخامة له عنوان واحد في تيارت
                </>
              ) : (
                <>
                  <span className="text-brand-yellow font-cursive text-4xl md:text-5xl block mb-2">
                    « 3AMRI DAREK M3ANA »
                  </span>
                  La Beauté a Son Adresse
                </>
              )}
            </h2>

            <p className="text-sm md:text-base text-gray-300 leading-relaxed">
              {i18n.language === "ar"
                ? "في متجر داري بيل بتيارت، نؤمن أن مائدة الطعام هي قلب البيت الجزائري الأصيل. نحرص على انتقاء أفخم أطقم البورسلان المذهبة، والقدور التركية الجرانيت، وأرقى الملاعق الملكية لتضفي لمسة استثنائية على مناسباتك وأيامك اليومية."
                : "Chez Dari Belle Tiaret, nous célébrons la convivialité et le raffinement des réceptions algériennes. Nous sélectionnons avec passion les plus beaux services de table en porcelaine fine, batteries de cuisine granite haute résistance et pièces d'orfèvrerie pour magnifier votre intérieur."}
            </p>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-rose flex items-center justify-center shrink-0">
                  <MapPin size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-yellow">
                    {i18n.language === "ar" ? "المقر والمحل التجاري" : "Magasin à Tiaret"}
                  </h4>
                  <p className="text-xs text-gray-300">
                    Route Lacadémie, à côté du Printemps, Tiaret
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2" dir="ltr">
                <Phone size={16} className="text-brand-yellow" />
                <span className="text-xs font-bold text-white">06 59 40 84 03</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/catalog"
                className="inline-flex items-center gap-2 bg-brand-rose hover:bg-[#b81f42] text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-xl shadow-brand-rose/30 transition-all hover:scale-105 active:scale-95"
              >
                <span>{t("home.heroCta")}</span>
              </Link>
            </div>
          </div>

          {/* Right Imagery Collage */}
          <div className="relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Image in House arch shape */}
              <div className="rounded-t-[8rem] rounded-b-3xl overflow-hidden border-4 border-brand-yellow/60 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop"
                  alt="Dari Belle Tiaret Vaisselle"
                  className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -start-6 bg-brand-cream text-brand-navy p-5 rounded-2xl shadow-2xl border border-amber-200/60 max-w-[240px]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-brand-rose text-lg font-black">★ ★ ★ ★ ★</span>
                </div>
                <p className="text-xs font-bold text-brand-navy">
                  {i18n.language === "ar"
                    ? "الخيار الأول للعائلات والعرائس في تيارت وكامل الغرب الجزائري"
                    : "Le choix n°1 des trousseaux de mariée et réceptions à Tiaret"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
