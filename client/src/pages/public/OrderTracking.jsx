import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { Search, CheckCircle2, Clock, Truck, PackageCheck, XCircle } from "lucide-react";
import { api } from "../../api/endpoints";
import { formatDZD, formatDate } from "../../utils/formatters";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

export const OrderTracking = () => {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();

  const [orderNumber, setOrderNumber] = useState(searchParams.get("orderNumber") || "");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleTrack = async (e) => {
    if (e) e.preventDefault();
    if (!orderNumber.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const res = await api.trackOrder(orderNumber.trim(), phone.trim());
      setOrder(res.data.data);
    } catch (err) {
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderNumber) {
      handleTrack();
    }
  }, []);

  const getStatusStep = (status) => {
    switch (status) {
      case "pending":
        return 1;
      case "confirmed":
        return 2;
      case "shipped":
        return 3;
      case "delivered":
        return 4;
      case "cancelled":
      case "returned":
        return -1;
      default:
        return 1;
    }
  };

  const currentStep = order ? getStatusStep(order.status) : 0;

  const steps = [
    { num: 1, label: t("tracking.statusPending"), icon: Clock },
    { num: 2, label: t("tracking.statusConfirmed"), icon: CheckCircle2 },
    { num: 3, label: t("tracking.statusShipped"), icon: Truck },
    { num: 4, label: t("tracking.statusDelivered"), icon: PackageCheck },
  ];

  return (
    <>
      <Helmet>
        <title>Suivre ma commande | Dari Belle Tiaret</title>
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <h1 className="text-3xl font-serif font-bold text-brand-navy">
            {t("tracking.title")}
          </h1>
          <p className="text-xs md:text-sm text-gray-500">
            {t("tracking.subtitle")}
          </p>
        </div>

        {/* Tracking Search Form */}
        <form
          onSubmit={handleTrack}
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-md space-y-4 mb-10"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t("tracking.inputLabel")}
              placeholder="Ex: DB-123456-789"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
              required
            />
            <Input
              label={t("tracking.phoneLabel")}
              placeholder="06 59 40 84 03"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              dir="ltr"
            />
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading}>
            <Search size={16} />
            <span>{t("tracking.search")}</span>
          </Button>
        </form>

        {/* Results */}
        {searched && !order && !loading && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 p-8 space-y-2">
            <XCircle size={40} className="text-red-500 mx-auto" />
            <h3 className="font-serif font-bold text-lg text-brand-navy">
              Commande introuvable
            </h3>
            <p className="text-xs text-gray-500">
              Vérifiez votre numéro de commande ou contactez notre boutique au 06 59 40 84 03.
            </p>
          </div>
        )}

        {order && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
            {/* Header */}
            <div className="p-6 bg-brand-navy text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-luxury text-brand-yellow font-bold">
                  COMMANDE
                </span>
                <h3 className="text-xl font-mono font-bold">{order.orderNumber}</h3>
                <p className="text-xs text-gray-300 mt-1">
                  Enregistrée le {formatDate(order.createdAt, i18n.language === "ar")}
                </p>
              </div>

              <div className="sm:text-end">
                <span className="text-xs text-gray-300 block">Montant à payer :</span>
                <span className="text-xl font-black text-brand-yellow">
                  {formatDZD(order.total, i18n.language === "ar")}
                </span>
              </div>
            </div>

            {/* Timeline */}
            {currentStep === -1 ? (
              <div className="p-8 text-center bg-red-50 text-red-700">
                <XCircle size={36} className="mx-auto mb-2" />
                <h4 className="font-bold">Cette commande a été annulée ou retournée.</h4>
              </div>
            ) : (
              <div className="p-8">
                <div className="relative flex items-center justify-between">
                  {/* Connecting line */}
                  <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-gray-200 z-0" />
                  <div
                    className="absolute top-1/2 left-0 -translate-y-1/2 h-1 bg-brand-rose z-0 transition-all duration-500"
                    style={{
                      width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                    }}
                  />

                  {steps.map((step) => {
                    const isDone = currentStep >= step.num;
                    const isCurrent = currentStep === step.num;
                    const Icon = step.icon;

                    return (
                      <div
                        key={step.num}
                        className="relative z-10 flex flex-col items-center group"
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            isDone
                              ? "bg-brand-rose text-white shadow-md"
                              : "bg-white border-2 border-gray-300 text-gray-400"
                          } ${isCurrent ? "ring-4 ring-brand-rose/20 scale-110" : ""}`}
                        >
                          <Icon size={18} />
                        </div>
                        <span
                          className={`mt-2 text-[11px] font-bold text-center max-w-[80px] ${
                            isDone ? "text-brand-navy" : "text-gray-400"
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Status History & Items */}
            <div className="p-6 border-t border-gray-100 bg-brand-cream/30 space-y-4">
              <h4 className="font-serif font-bold text-sm text-brand-navy">
                Détails des articles commandés :
              </h4>
              <div className="divide-y divide-gray-100">
                {order.items.map((it, idx) => (
                  <div key={idx} className="py-2.5 flex justify-between text-xs">
                    <div>
                      <span className="font-bold text-brand-navy">{it.name}</span>
                      <span className="text-gray-500 block">
                        Qté : {it.quantity} × {formatDZD(it.price, i18n.language === "ar")}
                      </span>
                    </div>
                    <span className="font-bold text-brand-rose">
                      {formatDZD(it.price * it.quantity, i18n.language === "ar")}
                    </span>
                  </div>
                ))}
              </div>

              {order.statusHistory?.length > 0 && (
                <div className="pt-4 border-t space-y-2">
                  <h4 className="font-serif font-bold text-xs text-brand-navy uppercase tracking-wider">
                    Historique du statut :
                  </h4>
                  <div className="space-y-1 text-xs text-gray-600">
                    {order.statusHistory.map((h, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-brand-rose">•</span>
                        <span>
                          {formatDate(h.date, i18n.language === "ar")} : {h.note}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
