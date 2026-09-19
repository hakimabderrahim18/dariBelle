import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Play, Sparkles, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
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
          setSlides([
            {
              image: {
                desktop:
                  "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1000&auto=format&fit=crop",
              },
              title: {
                fr: "Sublimez Votre Intérieur avec Élégance",
                ar: "عمري دارك معنا بفخامة وأناقة عصرية",
              },
              subtitle: {
                fr: "Découvrez des pièces raffinées pour votre table & maison qui marient confort, authenticité et élégance intemporelle. Magasin à Tiaret, livraison 58 Wilayas.",
                ar: "أرقى تشكيلات أطقم المائدة والقدور التركية في تيارت مع توصيل سريع ومضمون حتى باب دارك في 58 ولاية.",
              },
              badge: "TRENDING COLLECTIONS ✦",
              ctaLabel: {
                fr: "Explorer la Collection",
                ar: "اكتشف التشكيلة الآن",
              },
              ctaLink: "/catalog",
            },
            {
              image: {
                desktop:
                  "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=1000&auto=format&fit=crop",
              },
              title: {
                fr: "L'Élégance Culinaire au Quotidien",
                ar: "الجمال له عنوان واحد : داري بيل تيارت",
              },
              subtitle: {
                fr: "Batteries de cuisine granite & ustensiles faits pour durer. Le savoir-faire au service de vos repas de famille.",
                ar: "أطقم طهي جرانيت وإينوكس أصلي مع ضمان الجودة والمتانة. ارتقي بمطبخك إلى المستوى الملكي.",
              },
              badge: "OFFRES SPÉCIALES -40%",
              ctaLabel: {
                fr: "Profiter des Promos",
                ar: "استفد من التخفيضات",
              },
              ctaLink: "/catalog?tag=promo",
            },
          ]);
        }
      } catch (e) {
        // Fallback handled
      }
    };
    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;
  const slide = slides[currentIndex];

  return (
    <section className="relative w-full bg-[#FAF7F2] border-b border-[#EAE4DC] overflow-hidden py-8 md:py-16 lg:py-20">
      {/* Delicate background decorative wireframe arch and sparkles */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg
          className="absolute end-0 top-1/2 -translate-y-1/2 w-[700px] h-[550px]"
          viewBox="0 0 700 550"
          fill="none"
        >
          <ellipse
            cx="480"
            cy="275"
            rx="320"
            ry="240"
            stroke="#D4A373"
            strokeWidth="1"
            strokeDasharray="4 6"
          />
          <path
            d="M280 80 Q 420 180 560 120"
            stroke="#9E532B"
            strokeWidth="0.8"
          />
        </svg>
      </div>

      {/* Decorative Golden Star Accent */}
      <div className="absolute end-[44%] top-16 text-[#D4A373] text-xl animate-pulse pointer-events-none hidden lg:block">
        ✦
      </div>
      <div className="absolute end-[15%] bottom-24 text-[#9E532B] text-sm pointer-events-none hidden lg:block">
        ✦
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center"
          >
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-6">
              {/* Badge */}
              <motion.div
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F5EFE6] border border-[#E8E2D9] text-[#9E532B] text-[11px] font-bold uppercase tracking-wider"
              >
                <span>{slide.badge || "COLLECTIONS TENDANCES ✦"}</span>
              </motion.div>

              {/* Title with Italic Accent */}
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#1F1E1D] leading-[1.12] tracking-tight"
              >
                {i18n.language === "ar" ? (
                  <span>
                    عمري <span className="text-[#9E532B] font-serif italic">دارك</span> معنا بأرقى فخامة.
                  </span>
                ) : (
                  <span>
                    Sublimez Votre{" "}
                    <span className="text-[#9E532B] font-serif italic font-normal">
                      Intérieur
                    </span>{" "}
                    avec Élégance.
                  </span>
                )}
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm sm:text-base text-[#6E6B67] leading-relaxed max-w-lg font-sans"
              >
                {i18n.language === "ar" && slide.subtitle?.ar
                  ? slide.subtitle.ar
                  : slide.subtitle?.fr}
              </motion.p>

              {/* Actions: Primary CTA + Video button */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap items-center gap-4 pt-2"
              >
                <Link
                  to={slide.ctaLink || "/catalog"}
                  className="bg-[#9E532B] hover:bg-[#85401B] text-white font-medium text-sm px-7 py-3.5 rounded-full shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] inline-flex items-center gap-2"
                >
                  <span>
                    {i18n.language === "ar" && slide.ctaLabel?.ar
                      ? slide.ctaLabel.ar
                      : slide.ctaLabel?.fr || "Explorer la Collection"}
                  </span>
                  <ArrowRight size={16} />
                </Link>

                <Link
                  to="/about"
                  className="inline-flex items-center gap-2.5 text-sm font-semibold text-[#1F1E1D] hover:text-[#9E532B] px-4 py-3 rounded-full transition-colors group"
                >
                  <span className="w-10 h-10 rounded-full bg-white border border-[#EAE4DC] flex items-center justify-center shadow-xs group-hover:border-[#9E532B] transition-colors">
                    <Play size={14} className="fill-[#1F1E1D] text-[#1F1E1D] ms-0.5 group-hover:fill-[#9E532B] group-hover:text-[#9E532B] transition-colors" />
                  </span>
                  <span>{i18n.language === "ar" ? "شاهد الفيديو" : "Visite Boutique"}</span>
                </Link>
              </motion.div>

              {/* Social Proof Row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-4 pt-4 border-t border-[#EDE6DB]"
              >
                <div className="flex -space-x-2 rtl:space-x-reverse">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&crop=face"
                    alt="Client"
                    className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-xs"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&crop=face"
                    alt="Client"
                    className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-xs"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&crop=face"
                    alt="Client"
                    className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-xs"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&crop=face"
                    alt="Client"
                    className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-xs"
                  />
                </div>
                <div className="text-xs text-[#6E6B67] font-medium">
                  {i18n.language === "ar"
                    ? "أكثر من 5,000 منزل مجهز في الجزائر ★★★★★"
                    : "Recommandé par plus de 5 000 foyers ★★★★★"}
                </div>
              </motion.div>
            </div>

            {/* Right Visual Column with Floating Highlight Card */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              <div className="relative w-full max-w-lg aspect-[4/3] sm:aspect-square flex items-center justify-center">
                {/* Main Hero Product Visual */}
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.7 }}
                  className="w-full h-full rounded-3xl overflow-hidden shadow-xl shadow-amber-950/5 relative bg-white/40 p-4 border border-[#EAE4DC]"
                >
                  <img
                    src={slide.image?.desktop}
                    alt={slide.title?.fr}
                    className="w-full h-full object-cover object-center rounded-2xl"
                  />
                </motion.div>

                {/* Floating Product Highlight Card (as seen on mockup) */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="absolute -bottom-6 -end-2 sm:end-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-gray-100 max-w-[220px] w-full"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-[#1F1E1D] font-sans line-clamp-1">
                        {i18n.language === "ar" ? "أطقم نورديك" : "Accent Chair / Service Royal"}
                      </h4>
                      <p className="text-[10px] text-gray-500 font-medium">
                        {i18n.language === "ar" ? "بيج كوزي" : "Cozy Beige · Grès"}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#1F1E1D]">
                      18 900 DA
                    </span>
                  </div>

                  {/* Colors Swatches */}
                  <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-500">
                    <span>{i18n.language === "ar" ? "الألوان" : "Colors"}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-[#EAE4DC] border border-gray-300" />
                      <span className="w-3 h-3 rounded-full bg-[#9E532B]" />
                      <span className="w-3 h-3 rounded-full bg-[#5A7365]" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slide navigation controls */}
        {slides.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 transition-all rounded-full ${
                  currentIndex === idx
                    ? "w-8 bg-[#9E532B]"
                    : "w-2 bg-[#D4A373]/40 hover:bg-[#D4A373]"
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};