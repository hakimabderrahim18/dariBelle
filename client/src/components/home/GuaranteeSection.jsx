import React from "react";
import { useTranslation } from "react-i18next";
import { Truck, PackageCheck, Banknote, Headset } from "lucide-react";

export const GuaranteeSection = () => {
  const { t } = useTranslation();

  const guarantees = [
    {
      icon: Truck,
      color: "bg-brand-rose/10 text-brand-rose",
      title: t("home.trustDeliveryTitle"),
      desc: t("home.trustDeliveryDesc"),
    },
    {
      icon: PackageCheck,
      color: "bg-brand-yellow/15 text-amber-700",
      title: t("home.trustPackingTitle"),
      desc: t("home.trustPackingDesc"),
    },
    {
      icon: Banknote,
      color: "bg-brand-teal/10 text-brand-teal",
      title: t("home.trustCodTitle"),
      desc: t("home.trustCodDesc"),
    },
    {
      icon: Headset,
      color: "bg-brand-navy/10 text-brand-navy",
      title: t("home.trustSupportTitle"),
      desc: t("home.trustSupportDesc"),
    },
  ];

  return (
    <section className="py-16 px-4 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {guarantees.map((g, idx) => {
            const Icon = g.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-4 p-5 rounded-2xl bg-brand-cream/40 border border-gray-100 hover:shadow-md transition-all"
              >
                <div className={`p-3.5 rounded-2xl ${g.color} shrink-0 shadow-sm`}>
                  <Icon size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-brand-navy font-serif">
                    {g.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
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
