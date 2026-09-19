import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../api/endpoints";

export const HeroSlider = () => {
  const { t, i18n } = useTranslation();
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await api.getHeroSlides();
        if (res.data.data?.length > 0) {
          setSlides(res.data.data);
        } else {
          // Fallback slides
          setSlides([
            {
              image: {
                desktop:
                  "https://images.unsplash.com/photo-1615865417491-9941019fbc00?w=1600&auto=format&fit=crop",
              },
              title: {
                fr: "3AMRI DAREK M3ANA",
                ar: "عمري دارك معانا بفخامة لا مثيل لها",
              },
              subtitle: {
                fr: "L'art de la table et la vaisselle d'exception à Tiaret. Livraison sécurisée dans les 58 Wilayas.",
                ar: "أرقى تشكيلات أطقم المائدة والقدور التركية في تيارت. توصيل سريع ومضمون حتى باب دارك في 58 ولاية.",
              },
              badge: "NOUVELLE COLLECTION 2026",
              ctaLabel: {
                fr: "Explorer la Collection",
                ar: "اكتشف التشكيلة الآن",
              },
              ctaLink: "/catalog",
            },
            {
              image: {
                desktop:
                  "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=1600&auto=format&fit=crop",
              },
              title: {
                fr: "La Beauté a Son Adresse",
                ar: "الجمال له عنوان واحد : داري بيل تيارت",
              },
              subtitle: {
                fr: "Batteries de cuisine granite & inox haute résistance. L'élégance culinaire garantie au meilleur prix d'Algérie.",
                ar: "أطقم طهي جرانيت وإينوكس أصلي مع ضمان الجودة والمتانة. ارتقي بمطبخك إلى المستوى الملكي.",
              },
              badge: "PROMOTIONS EXCLUSIVES",
              ctaLabel: {
                fr: "Profiter des Promos",
                ar: "استفد من التخفيضات",
              },
              ctaLink: "/catalog?tag=promo",
            },
          ]);
        }
      } catch (e) {
        // Fallback slides
      }
    };
    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;
  const slide = slides[currentIndex];

  return (
    <div className="relative w-full h-[460px] md:h-[580px] lg:h-[620px] bg-brand-navy overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {/* Background Image with warm gradient overlay */}
          <img
            src={slide.image?.desktop}
            alt={slide.title?.fr}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/90 via-brand-navy/60 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Decorative Golden House Silhouette in Background */}
      <div className="absolute end-10 bottom-0 opacity-10 pointer-events-none hidden lg:block">
        <div className="w-96 h-96 border-8 border-brand-yellow rounded-t-full" />
      </div>

      {/* Slide Content */}
      <div className="relative z-10 max-w-7xl mx-auto h-full px-6 flex flex-col justify-center">
        <div className="max-w-2xl space-y-4">
          {/* Badge */}
          {slide.badge && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="inline-flex items-center gap-1.5 bg-brand-yellow text-brand-navy text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-lg">
                <Sparkles size={14} className="fill-brand-navy" />
                {slide.badge}
              </span>
            </motion.div>
          )}

          {/* Title */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-tight"
          >
            {i18n.language === "ar" && slide.title?.ar
              ? slide.title.ar
              : slide.title?.fr}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm md:text-base text-gray-200 leading-relaxed font-sans max-w-xl"
          >
            {i18n.language === "ar" && slide.subtitle?.ar
              ? slide.subtitle.ar
              : slide.subtitle?.fr}
          </motion.p>

          {/* Slogans Sub-badge */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="flex items-center gap-3 pt-1"
          >
            <span className="font-cursive text-brand-yellow text-2xl">
              « {t("brand.sloganAr")} »
            </span>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center gap-4 pt-3"
          >
            <Link
              to={slide.ctaLink || "/catalog"}
              className="inline-flex items-center gap-2 bg-brand-rose hover:bg-[#b81f42] text-white font-bold text-sm md:text-base px-7 py-3.5 rounded-xl shadow-xl shadow-brand-rose/30 transition-all hover:scale-105 active:scale-95"
            >
              <span>
                {i18n.language === "ar" && slide.ctaLabel?.ar
                  ? slide.ctaLabel.ar
                  : slide.ctaLabel?.fr || t("home.heroCta")}
              </span>
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/catalog?tag=promo"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-sm md:text-base px-6 py-3.5 rounded-xl backdrop-blur-md border border-white/20 transition-all"
            >
              <span>{t("home.tabPromos")}</span>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 end-6 z-20 flex items-center gap-2">
          <button
            onClick={() =>
              setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
            }
            className="w-10 h-10 rounded-full bg-black/40 hover:bg-brand-rose text-white flex items-center justify-center transition-colors backdrop-blur-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="text-white text-xs font-mono font-bold px-2">
            {currentIndex + 1} / {slides.length}
          </div>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % slides.length)}
            className="w-10 h-10 rounded-full bg-black/40 hover:bg-brand-rose text-white flex items-center justify-center transition-colors backdrop-blur-sm"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};
