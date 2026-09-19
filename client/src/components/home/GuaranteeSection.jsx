import React from "react";
import { useTranslation } from "react-i18next";
import { Truck, RotateCcw, ShieldCheck, Headphones } from "lucide-react";

export const GuaranteeSection = () => {
  const { t, i18n } = useTranslation();

  const guarantees = [
    {
      icon: Truck,
      title: i18n.language === "ar" ? "توصيل لـ 58 ولاية" : "Free Shipping",
      desc: i18n.language === "ar" ? "مجاني للطلبات فوق 35 000 دج" : "On orders over 35 000 DA",
    },
    {
      icon: RotateCcw,
      title: i18n.language === "ar" ? "إرجاع واستبدال سلس" : "Easy Returns",
      desc: i18n.language === "ar" ? "ضمان المعاينة خلال 48 ساعة" : "48-hour return policy",
    },
    {
      icon: ShieldCheck,
      title: i18n.language === "ar" ? "دفع آمن عند الاستلام" : "Secure Payment",
      desc: i18n.language === "ar" ? "افحص طلبيتك قبل الدفع" : "100% secure COD delivery",
    },
    {
      icon: Headphones,
      title: i18n.language === "ar" ? "خدمة عملاء بتيارت" : "Dedicated Support",
      desc: i18n.language === "ar" ? "فريقنا في خدمتكم يومياً" : "We are here to help you",
    },
  ];

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 bg-[#FAF7F2] border-t border-[#EAE4DC]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {guarantees.map((g, idx) => {
            const Icon = g.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3.5 group"
              >
                <div className="text-[#1F1E1D] group-hover:text-[#9E532B] transition-colors shrink-0">
                  <Icon size={26} strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#1F1E1D] font-sans">
                    {g.title}
                  </h4>
                  <p className="text-[11px] text-[#6E6B67]">
                    {g.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};