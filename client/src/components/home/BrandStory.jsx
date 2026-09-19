import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MapPin, Phone, ArrowRight, Sparkles } from "lucide-react";

export const BrandStory = () => {
  const { t, i18n } = useTranslation();

  const articles = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&auto=format&fit=crop",
      date: "14 Septembre 2026 · Conseils Déco",
      dateAr: "14 سبتمبر 2026 · نصائح الديكور",
      title: "Conseils pour dresser une table de réception digne d'un palace",
      titleAr: "أسرار تزيين مائدة عزومات فخمة تبهر ضيوفك",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop",
      date: "08 Septembre 2026 · Cuisine & Organisation",
      dateAr: "08 سبتمبر 2026 · تنظيم المطبخ",
      title: "Bien organiser ses épices et bocaux dans une cuisine moderne",
      titleAr: "طرق عملية وأنيقة لترتيب برطمانات التوابل في المطبخ العصري",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&auto=format&fit=crop",
      date: "02 Septembre 2026 · Entretien & Savoir-faire",
      dateAr: "02 سبتمبر 2026 · العناية والخبرة",
      title: "Comment entretenir sa batterie de cuisine granite et fonte",
      titleAr: "كيفية الحفاظ على أطقم الطهي الجرانيت لتدوم لسنوات طويلة",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#FAF7F2] border-t border-[#EAE4DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* 1. Home Inspiration Section (matching mockup) */}
        <div>
          <div className="mb-8">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1F1E1D]">
              {i18n.language === "ar" ? "إلهام وأفكار للمنزل" : "Home Inspiration"}
            </h3>
            <p className="text-xs sm:text-sm text-[#6E6B67] mt-1">
              {i18n.language === "ar"
                ? "أفكار ونصائح عملية لمائدة عصرية وحياة أرقى."
                : "Tips, ideas & inspiration for a better dining and living."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((art) => (
              <div
                key={art.id}
                className="bg-white rounded-2xl overflow-hidden border border-[#EAE4DC] hover:shadow-md transition-shadow group flex flex-col"
              >
                <div className="h-48 overflow-hidden bg-[#F5EFE6]">
                  <img
                    src={art.image}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9E532B]">
                      {i18n.language === "ar" ? art.dateAr : art.date}
                    </span>
                    <h4 className="text-sm font-bold text-[#1F1E1D] group-hover:text-[#9E532B] transition-colors mt-1.5 leading-snug">
                      {i18n.language === "ar" ? art.titleAr : art.title}
                    </h4>
                  </div>
                  <Link
                    to="/about"
                    className="text-xs font-semibold text-[#1F1E1D] hover:text-[#9E532B] inline-flex items-center gap-1 self-start"
                  >
                    <span>{i18n.language === "ar" ? "اقرأ المزيد" : "Lire la suite"}</span>
                    <ArrowRight size={12} className="rtl:scale-x-[-1]" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Brand Story / Dari Belle Tiaret presentation card */}
        <div className="bg-[#1F1E1D] text-white rounded-3xl p-8 sm:p-12 lg:p-14 relative overflow-hidden">
          {/* Subtle gold accent ring in background */}
          <div className="absolute -end-16 -bottom-16 w-80 h-80 rounded-full border border-[#D4A373]/20 pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#D4A373] text-[11px] font-bold uppercase tracking-wider">
                <Sparkles size={13} />
                <span>3AMRI DAREK M3ANA · TIARET</span>
              </div>

              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold leading-tight">
                {i18n.language === "ar" ? (
                  <span>
                    الجمال له عنوان واحد : <span className="text-[#D4A373] font-serif italic">داري بيل تيارت</span>
                  </span>
                ) : (
                  <span>
                    La Beauté a Son Adresse : <span className="text-[#D4A373] font-serif italic">Dari Belle Tiaret</span>
                  </span>
                )}
              </h3>

              <p className="text-sm text-gray-300 leading-relaxed font-sans max-w-xl">
                {i18n.language === "ar"
                  ? "متجر داري بيل في تيارت هو وجهتكم الأولى لأرقى تشكيلات أطقم السفرة الملكية، أواني الطهي التركية الجرانيت، والملاعق المطلية بالذهب. نجمع بين الأصالة الجزائرية والتصميم الاسكندنافي العصري."
                  : "Chez Dari Belle Tiaret, nous célébrons la convivialité et l'art de recevoir. Retrouvez en magasin ou en livraison sécurisée les plus belles pièces de vaisselle, casseroles et orfèvrerie sélectionnées avec exigence."}
              </p>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#9E532B] flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4A373]">
                      {i18n.language === "ar" ? "المقر والمحل التجاري" : "Magasin à Tiaret"}
                    </h4>
                    <p className="text-xs text-gray-300">
                      Route Lacadémie, à côté du Printemps, Tiaret
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2" dir="ltr">
                  <Phone size={15} className="text-[#D4A373]" />
                  <span className="text-xs font-bold text-white">06 59 40 84 03</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop"
                alt="Dari Belle Tiaret"
                className="w-full h-72 sm:h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};