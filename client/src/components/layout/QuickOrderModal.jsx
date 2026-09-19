import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle2, ShieldCheck, Phone } from "lucide-react";
import toast from "react-hot-toast";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useUIStore } from "../../store/uiStore";
import { api } from "../../api/endpoints";
import { formatDZD } from "../../utils/formatters";
import { ALGERIA_WILAYAS } from "../../utils/wilayasAlgeria";

export const QuickOrderModal = () => {
  const { t, i18n } = useTranslation();
  const product = useUIStore((state) => state.quickOrderProduct);
  const setQuickOrderProduct = useUIStore((state) => state.setQuickOrderProduct);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [wilayaCode, setWilayaCode] = useState("14"); // Default Tiaret
  const [commune, setCommune] = useState("");
  const [address, setAddress] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  if (!product) return null;

  const currentPrice =
    product.salePrice && product.salePrice < product.price ? product.salePrice : product.price;

  const selectedWilayaObj =
    ALGERIA_WILAYAS.find((w) => w.code.toString() === wilayaCode) || ALGERIA_WILAYAS[13];
  const shippingFee = selectedWilayaObj.fee;
  const subtotal = currentPrice * quantity;
  const total = subtotal + shippingFee;

  const handleQuickSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone || !commune || !address) {
      toast.error(
        i18n.language === "ar"
          ? "يرجى ملء جميع الحقول المطلوبة."
          : "Veuillez remplir toutes les informations requises."
      );
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        items: [
          {
            product: product._id,
            quantity,
          },
        ],
        customer: {
          name,
          phone,
          wilaya: `${selectedWilayaObj.code} - ${selectedWilayaObj.nameFr}`,
          commune,
          address,
          note: "Commande Express 1-Clic",
        },
      };

      const res = await api.createOrder(orderPayload);
      setIsSuccess(true);
      setCreatedOrder(res.data.data);
      toast.success(
        i18n.language === "ar"
          ? "تم تسجيل طلبيتك بنجاح !"
          : "Votre commande a été validée avec succès !"
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Erreur lors de la validation de la commande."
      );
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setQuickOrderProduct(null);
    setIsSuccess(false);
    setCreatedOrder(null);
  };

  return (
    <Modal
      isOpen={!!product}
      onClose={closeModal}
      title={
        isSuccess
          ? t("orderSuccess.title")
          : i18n.language === "ar"
          ? "طلب سريع - الدفع عند الاستلام"
          : "Commande Rapide Express (COD)"
      }
      maxWidth="max-w-lg"
    >
      {isSuccess && createdOrder ? (
        <div className="text-center py-4 space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={36} />
          </div>
          <h4 className="text-xl font-bold font-serif text-brand-navy">
            {t("orderSuccess.title")}
          </h4>
          <div className="p-4 bg-brand-cream rounded-xl border border-amber-200/50 text-start space-y-2">
            <p className="text-xs text-gray-500">{t("orderSuccess.orderNumber")} :</p>
            <p className="text-lg font-mono font-bold text-brand-rose">
              {createdOrder.orderNumber}
            </p>
            <p className="text-xs text-gray-600">
              {t("orderSuccess.confirmationNotice")}
            </p>
          </div>

          <a
            href={`https://wa.me/213659408403?text=${encodeURIComponent(
              `Salam Dari Belle, je confirme ma commande rapide #${createdOrder.orderNumber} pour ${createdOrder.customer.name} à ${createdOrder.customer.wilaya}.`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition-colors"
          >
            <Phone size={16} />
            <span>{t("orderSuccess.whatsappConfirm")}</span>
          </a>

          <Button variant="outline" className="w-full" onClick={closeModal}>
            {t("orderSuccess.backHome")}
          </Button>
        </div>
      ) : (
        <form onSubmit={handleQuickSubmit} className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-brand-cream rounded-xl border border-gray-100">
            <img
              src={product.images?.[0] || ""}
              alt={product.name?.fr}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h5 className="text-xs font-bold text-brand-navy line-clamp-1">
                {i18n.language === "ar" && product.name?.ar
                  ? product.name.ar
                  : product.name?.fr}
              </h5>
              <p className="text-sm font-black text-brand-rose mt-0.5">
                {formatDZD(currentPrice, i18n.language === "ar")}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <span>Qté:</span>
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="bg-white border rounded-lg px-2 py-1 text-xs"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Input
            label={t("checkout.fullName")}
            placeholder="Ex: Fatima Zohra"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label={t("checkout.phone")}
            placeholder="06 59 40 84 03 / 05 51 00 70 98"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            dir="ltr"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-start">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-navy mb-1.5">
                {t("checkout.wilaya")}
              </label>
              <select
                value={wilayaCode}
                onChange={(e) => setWilayaCode(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 px-3 text-sm text-brand-navy focus:border-brand-rose focus:ring-1 focus:ring-brand-rose outline-none"
              >
                {ALGERIA_WILAYAS.map((w) => (
                  <option key={w.code} value={w.code}>
                    {w.code} - {i18n.language === "ar" ? w.nameAr : w.nameFr} (
                    {formatDZD(w.fee, i18n.language === "ar")})
                  </option>
                ))}
              </select>
            </div>

            <Input
              label={t("checkout.commune")}
              placeholder="Ex: Tiaret, Sougueur, Mahdia..."
              value={commune}
              onChange={(e) => setCommune(e.target.value)}
              required
            />
          </div>

          <Input
            label={t("checkout.address")}
            placeholder="Adresse exacte de livraison"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />

          <div className="p-3 bg-gray-50 rounded-xl space-y-1 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>{t("cart.subtotal")} :</span>
              <span className="font-semibold text-brand-navy">
                {formatDZD(subtotal, i18n.language === "ar")}
              </span>
            </div>
            <div className="flex justify-between">
              <span>{t("cart.shipping")} :</span>
              <span className="font-semibold text-brand-navy">
                {formatDZD(shippingFee, i18n.language === "ar")}
              </span>
            </div>
            <div className="flex justify-between pt-1 border-t text-sm font-bold text-brand-navy">
              <span>{t("cart.total")} :</span>
              <span className="text-brand-rose">
                {formatDZD(total, i18n.language === "ar")}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-gray-500">
            <ShieldCheck size={16} className="text-brand-teal shrink-0" />
            <span>
              {i18n.language === "ar"
                ? "الدفع نقداً للموزع عند فحص واستلام الطرد."
                : "Paiement en espèces au livreur lors de la livraison."}
            </span>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={loading}
          >
            {t("checkout.confirmOrder", {
              total: formatDZD(total, i18n.language === "ar"),
            })}
          </Button>
        </form>
      )}
    </Modal>
  );
};
