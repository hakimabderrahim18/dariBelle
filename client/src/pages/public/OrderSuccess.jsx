import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { CheckCircle2, Phone, Truck, ArrowRight, ShieldCheck, Home } from "lucide-react";
import confetti from "canvas-confetti";
import { api } from "../../api/endpoints";
import { formatDZD } from "../../utils/formatters";

export const OrderSuccess = () => {
  const { orderNumber } = useParams();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    if (!order && orderNumber) {
      const fetchOrder = async () => {
        try {
          const res = await api.trackOrder(orderNumber);
          if (res.data.data) {
            setOrder(res.data.data);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [order, orderNumber]);

  return (
    <>
      <Helmet>
        <title>Commande Confirmée | Dari Belle Tiaret</title>
      </Helmet>

      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/20">
          <CheckCircle2 size={44} />
        </div>

        <div>
          <span className="text-xs uppercase tracking-luxury font-black text-brand-rose">
            DARI BELLE TIARET
          </span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy mt-1">
            {t("orderSuccess.title")}
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            {t("orderSuccess.thankYou")}
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl text-start space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <span className="text-xs text-gray-500 block">
                {t("orderSuccess.orderNumber")}
              </span>
              <span className="text-xl font-mono font-black text-brand-rose">
                {order?.orderNumber || orderNumber}
              </span>
            </div>

            {order && (
              <div className="text-end">
                <span className="text-xs text-gray-500 block">Montant Total (COD)</span>
                <span className="text-lg font-black text-brand-navy">
                  {formatDZD(order.total, i18n.language === "ar")}
                </span>
              </div>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-brand-lightYellow border border-amber-200/60 text-xs text-amber-950 space-y-2">
            <p className="font-bold">
              📞 {t("orderSuccess.confirmationNotice")}
            </p>
            <p>
              Le paiement de{" "}
              <strong>
                {order ? formatDZD(order.total, i18n.language === "ar") : ""}
              </strong>{" "}
              s'effectuera en espèces directement auprès du livreur à la réception de votre colis.
            </p>
          </div>

          {order?.customer && (
            <div className="text-xs text-gray-600 space-y-1 pt-2">
              <p>
                <strong>Destinataire :</strong> {order.customer.name} ({order.customer.phone})
              </p>
              <p>
                <strong>Destination :</strong> {order.customer.commune}, {order.customer.wilaya}
              </p>
              <p>
                <strong>Adresse :</strong> {order.customer.address}
              </p>
            </div>
          )}
        </div>

        {/* CTAs */}
        <div className="space-y-3 pt-2">
          {/* WhatsApp Direct Confirmation */}
          <a
            href={`https://wa.me/213659408403?text=${encodeURIComponent(
              `Salam Dari Belle, je confirme ma commande #${order?.orderNumber || orderNumber}. Merci de préparer l'expédition.`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-2xl text-sm shadow-lg shadow-emerald-600/25 transition-all hover:scale-105 active:scale-95"
          >
            <Phone size={18} />
            <span>{t("orderSuccess.whatsappConfirm")}</span>
          </a>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              to={`/track-order?orderNumber=${order?.orderNumber || orderNumber}`}
              className="inline-flex items-center justify-center gap-2 bg-brand-navy hover:bg-brand-darkNavy text-white py-3.5 px-4 rounded-xl text-xs font-bold transition-colors"
            >
              <Truck size={16} />
              <span>{t("orderSuccess.trackOrder")}</span>
            </Link>

            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-brand-navy py-3.5 px-4 rounded-xl text-xs font-bold transition-colors"
            >
              <Home size={16} />
              <span>{t("orderSuccess.backHome")}</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
