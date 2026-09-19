import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Plus, Minus, Tag } from "lucide-react";
import toast from "react-hot-toast";
import { useCartStore } from "../../store/cartStore";
import { formatDZD } from "../../utils/formatters";
import { api } from "../../api/endpoints";

export const Cart = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const {
    items,
    removeItem,
    updateQuantity,
    getSubtotal,
    getTotal,
    getDiscount,
    coupon,
    setCoupon,
    removeCoupon,
  } = useCartStore();

  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const total = getTotal();

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;

    setApplyingCoupon(true);
    try {
      const res = await api.validateCoupon(couponCodeInput.trim(), subtotal);
      setCoupon(res.data.data);
      toast.success("Code promo appliqué avec succès !");
      setCouponCodeInput("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Code promo invalide.");
    } finally {
      setApplyingCoupon(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-24 px-4 text-center space-y-4">
        <div className="w-20 h-20 bg-brand-cream rounded-full flex items-center justify-center mx-auto text-gray-400">
          <ShoppingBag size={36} />
        </div>
        <h2 className="text-2xl font-bold font-serif text-brand-navy">{t("cart.empty")}</h2>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          Découvrez notre sélection d'arts de la table, vaisselle et batteries de cuisine granite.
        </p>
        <Link
          to="/catalog"
          className="inline-block bg-brand-rose text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-md hover:bg-[#b81f42] transition-colors"
        >
          {t("cart.startShopping")}
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Mon Panier | Dari Belle Tiaret</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-brand-navy mb-8">
          {t("cart.title")} ({items.length})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Items Table */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-100">
            {items.map((item) => (
              <div
                key={`${item.product}-${item.variantSku}`}
                className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
              >
                <img
                  src={item.image || "https://images.unsplash.com/photo-1615865417491-9941019fbc00?w=300"}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-xl border shrink-0"
                />

                <div className="flex-1 text-center sm:text-start space-y-1">
                  <h3 className="text-sm font-bold text-brand-navy">
                    {i18n.language === "ar" && item.nameAr ? item.nameAr : item.name}
                  </h3>
                  {item.variantName && (
                    <p className="text-xs text-gray-500">Variante: {item.variantName}</p>
                  )}
                  <p className="text-sm font-extrabold text-brand-rose">
                    {formatDZD(item.price, i18n.language === "ar")}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50">
                    <button
                      onClick={() =>
                        updateQuantity(item.product, item.variantSku, item.quantity - 1)
                      }
                      className="p-2 hover:text-brand-rose transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-3 text-xs font-bold text-brand-navy">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product, item.variantSku, item.quantity + 1)
                      }
                      className="p-2 hover:text-brand-rose transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.product, item.variantSku)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Box */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
            <h3 className="font-serif font-bold text-lg text-brand-navy border-b pb-3">
              Récapitulatif
            </h3>

            {/* Subtotal */}
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>{t("cart.subtotal")}</span>
                <span className="font-bold text-brand-navy">
                  {formatDZD(subtotal, i18n.language === "ar")}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-brand-rose font-bold">
                  <span>Remise coupon ({coupon?.code})</span>
                  <span>-{formatDZD(discount, i18n.language === "ar")}</span>
                </div>
              )}

              <div className="flex justify-between text-xs text-gray-500 pt-1">
                <span>Frais de livraison</span>
                <span>Calculés à l'étape suivante</span>
              </div>

              <div className="flex justify-between text-lg font-black text-brand-navy pt-3 border-t">
                <span>{t("cart.total")}</span>
                <span className="text-brand-rose">
                  {formatDZD(total, i18n.language === "ar")}
                </span>
              </div>
            </div>

            {/* Coupon input */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                placeholder={t("checkout.couponPlaceholder")}
                value={couponCodeInput}
                onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                className="flex-1 border rounded-xl px-3 py-2 text-xs font-mono uppercase outline-none focus:border-brand-rose"
              />
              <button
                type="submit"
                disabled={applyingCoupon}
                className="bg-brand-navy hover:bg-brand-darkNavy text-white px-4 py-2 rounded-xl text-xs font-bold"
              >
                {t("checkout.applyCoupon")}
              </button>
            </form>

            {coupon && (
              <div className="flex items-center justify-between text-xs bg-emerald-50 text-emerald-800 p-2.5 rounded-xl border border-emerald-200">
                <span className="font-bold">Code {coupon.code} activé !</span>
                <button
                  onClick={removeCoupon}
                  className="text-red-600 hover:underline font-bold"
                >
                  Supprimer
                </button>
              </div>
            )}

            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-brand-rose hover:bg-[#b81f42] text-white py-4 px-6 rounded-xl font-bold text-sm shadow-xl shadow-brand-rose/25 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <span>{t("cart.checkout")}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
