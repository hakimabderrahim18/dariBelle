import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  Phone,
  Tag,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { useCartStore } from "../../store/cartStore";
import { formatDZD } from "../../utils/formatters";
import { ALGERIA_WILAYAS } from "../../utils/wilayasAlgeria";
import { api } from "../../api/endpoints";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

export const Checkout = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const { items, getSubtotal, getDiscount, coupon, setCoupon, removeCoupon, clearCart } =
    useCartStore();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [wilayaCode, setWilayaCode] = useState("14"); // 14 is Tiaret (Dari Belle store)
  const [commune, setCommune] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [isDeskDelivery, setIsDeskDelivery] = useState(false);
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedWilayaObj =
    ALGERIA_WILAYAS.find((w) => w.code.toString() === wilayaCode) || ALGERIA_WILAYAS[13];

  const subtotal = getSubtotal();
  const isFreeShipping = subtotal >= 35000;
  const baseShippingFee = isDeskDelivery
    ? Math.max(250, selectedWilayaObj.fee - 200)
    : selectedWilayaObj.fee;
  const shippingFee = isFreeShipping ? 0 : baseShippingFee;
  const discount = getDiscount();
  const total = Math.max(0, subtotal + shippingFee - discount);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;

    try {
      const res = await api.validateCoupon(couponCodeInput.trim(), subtotal);
      setCoupon(res.data.data);
      toast.success("Code promo appliqué avec succès !");
      setCouponCodeInput("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Code promo non valide.");
    }
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error("Votre panier est vide.");
      return;
    }

    if (!name.trim()) {
      toast.error("Veuillez renseigner votre nom complet.");
      return;
    }

    // Phone validation
    const cleanedPhone = phone.replace(/[\s-]/g, "");
    if (!/^(05|06|07)[0-9]{8}$/.test(cleanedPhone)) {
      toast.error(
        i18n.language === "ar"
          ? "يرجى إدخال رقم هاتف جزائري صحيح (مثال: 0659408403)"
          : "Numéro de téléphone invalide (Ex: 06 59 40 84 03)"
      );
      return;
    }

    if (!commune.trim() || !address.trim()) {
      toast.error("Veuillez préciser votre commune et adresse de livraison.");
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        items: items.map((item) => ({
          product: item.product,
          quantity: item.quantity,
          variantSku: item.variantSku || null,
        })),
        customer: {
          name: name.trim(),
          phone: cleanedPhone,
          wilaya: `${selectedWilayaObj.code} - ${selectedWilayaObj.nameFr}`,
          commune: commune.trim(),
          address: address.trim(),
          note: note.trim(),
        },
        couponCode: coupon?.code || null,
        isDeskDelivery,
      };

      const res = await api.createOrder(orderPayload);
      const createdOrder = res.data.data;

      clearCart();
      toast.success(
        i18n.language === "ar"
          ? "تم تأكيد طلبك بنجاح !"
          : "Commande validée avec succès !"
      );

      navigate(`/order-success/${createdOrder.orderNumber}`, {
        state: { order: createdOrder },
      });
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message ||
          "Une erreur est survenue lors de l'enregistrement de votre commande."
      );
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-24 text-center px-4 space-y-4">
        <AlertCircle size={48} className="text-brand-rose mx-auto" />
        <h2 className="text-xl font-bold font-serif text-brand-navy">Panier vide</h2>
        <p className="text-xs text-gray-500">
          Veuillez ajouter des articles à votre panier avant de finaliser votre commande.
        </p>
        <button
          onClick={() => navigate("/catalog")}
          className="bg-brand-rose text-white text-xs font-bold px-6 py-2.5 rounded-xl"
        >
          Voir les produits
        </button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Finaliser ma Commande | Dari Belle Tiaret</title>
      </Helmet>

      <div className="bg-brand-cream/50 py-6 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-brand-navy">
            {t("checkout.title")}
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            {t("checkout.subtitle")}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <form onSubmit={handleOrderSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Step 1: Customer & Delivery Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b pb-3 text-base font-bold text-brand-navy font-serif">
                  <Truck size={20} className="text-brand-rose" />
                  <span>{t("checkout.customerInfo")}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label={t("checkout.fullName")}
                    placeholder="Ex: Amina Benali"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />

                  <Input
                    label={t("checkout.phone")}
                    placeholder="06 59 40 84 03 / 05 51 00 70 98"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    helperText={t("checkout.phoneHelper")}
                    required
                    dir="ltr"
                  />
                </div>

                {/* Wilaya Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-brand-navy mb-1.5">
                      {t("checkout.wilaya")} *
                    </label>
                    <select
                      value={wilayaCode}
                      onChange={(e) => setWilayaCode(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white py-2.5 px-3.5 text-sm text-brand-navy focus:border-brand-rose focus:ring-1 focus:ring-brand-rose outline-none"
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
                    placeholder="Ex: Tiaret Centre, Sougueur, Frenda..."
                    value={commune}
                    onChange={(e) => setCommune(e.target.value)}
                    required
                  />
                </div>

                {/* Delivery Option (Home vs Stop Desk) */}
                <div className="pt-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-navy mb-2">
                    Mode d'expédition
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label
                      className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        !isDeskDelivery
                          ? "border-brand-rose bg-brand-rose/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-2 text-xs font-bold text-brand-navy">
                        <input
                          type="radio"
                          name="deliveryType"
                          checked={!isDeskDelivery}
                          onChange={() => setIsDeskDelivery(false)}
                          className="text-brand-rose"
                        />
                        <span>Livraison à Domicile</span>
                      </div>
                      <span className="text-xs font-extrabold text-brand-rose">
                        {isFreeShipping
                          ? "GRATUITE"
                          : formatDZD(selectedWilayaObj.fee, i18n.language === "ar")}
                      </span>
                    </label>

                    <label
                      className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        isDeskDelivery
                          ? "border-brand-rose bg-brand-rose/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-2 text-xs font-bold text-brand-navy">
                        <input
                          type="radio"
                          name="deliveryType"
                          checked={isDeskDelivery}
                          onChange={() => setIsDeskDelivery(true)}
                          className="text-brand-rose"
                        />
                        <span>Stop Desk (Agence)</span>
                      </div>
                      <span className="text-xs font-extrabold text-brand-rose">
                        {isFreeShipping
                          ? "GRATUITE"
                          : formatDZD(baseShippingFee, i18n.language === "ar")}
                      </span>
                    </label>
                  </div>
                </div>

                <Input
                  label={t("checkout.address")}
                  placeholder="Rue, quartier, numéro de maison, repère..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />

                <Input
                  label={t("checkout.note")}
                  placeholder={t("checkout.notePlaceholder")}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              {/* Payment Mode Note */}
              <div className="bg-brand-cream/80 p-5 rounded-2xl border border-amber-200/60 flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-brand-yellow/20 text-brand-navy shrink-0">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-brand-navy">
                    {t("checkout.paymentMethod")} : Paiement à la Livraison (COD)
                  </h4>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    {t("checkout.codDesc")}
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2: Order Summary & Confirmation */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="font-serif font-bold text-base text-brand-navy border-b pb-3">
                  {t("checkout.orderSummary")}
                </h3>

                {/* Items preview */}
                <div className="max-h-60 overflow-y-auto divide-y divide-gray-100 pr-1">
                  {items.map((item) => (
                    <div
                      key={`${item.product}-${item.variantSku}`}
                      className="py-3 flex items-center justify-between text-xs gap-3"
                    >
                      <img
                        src={item.image || "https://images.unsplash.com/photo-1615865417491-9941019fbc00?w=100"}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover border shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-brand-navy truncate">
                          {i18n.language === "ar" && item.nameAr ? item.nameAr : item.name}
                        </p>
                        <p className="text-gray-500 text-[11px]">
                          Qté : {item.quantity} × {formatDZD(item.price, i18n.language === "ar")}
                        </p>
                      </div>
                      <span className="font-extrabold text-brand-navy">
                        {formatDZD(item.price * item.quantity, i18n.language === "ar")}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Coupon Box */}
                <div className="pt-2 border-t">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={t("checkout.couponPlaceholder")}
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                      className="flex-1 border rounded-xl px-3 py-2 text-xs font-mono uppercase outline-none focus:border-brand-rose"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="bg-brand-navy hover:bg-brand-darkNavy text-white px-3 py-2 rounded-xl text-xs font-bold"
                    >
                      {t("checkout.applyCoupon")}
                    </button>
                  </div>

                  {coupon && (
                    <div className="flex items-center justify-between text-xs bg-emerald-50 text-emerald-800 p-2 rounded-lg mt-2">
                      <span className="font-bold">Code {coupon.code} (-{formatDZD(discount, i18n.language === "ar")})</span>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-red-600 hover:underline font-bold"
                      >
                        Retirer
                      </button>
                    </div>
                  )}
                </div>

                {/* Calculation breakdown */}
                <div className="space-y-2 pt-3 border-t text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>{t("cart.subtotal")} :</span>
                    <span className="font-bold text-brand-navy">
                      {formatDZD(subtotal, i18n.language === "ar")}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Frais de livraison ({selectedWilayaObj.nameFr}) :</span>
                    <span className="font-bold text-brand-navy">
                      {isFreeShipping ? (
                        <span className="text-emerald-700 font-bold">GRATUITE</span>
                      ) : (
                        formatDZD(shippingFee, i18n.language === "ar")
                      )}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-brand-rose font-bold">
                      <span>Remise :</span>
                      <span>-{formatDZD(discount, i18n.language === "ar")}</span>
                    </div>
                  )}

                  <div className="flex justify-between pt-2 border-t text-base font-black text-brand-navy">
                    <span>{t("cart.total")} :</span>
                    <span className="text-brand-rose">
                      {formatDZD(total, i18n.language === "ar")}
                    </span>
                  </div>
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="xl"
                  className="w-full"
                  loading={loading}
                >
                  {t("checkout.confirmOrder", {
                    total: formatDZD(total, i18n.language === "ar"),
                  })}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
