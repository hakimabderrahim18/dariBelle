import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import {
  ShoppingBag,
  Zap,
  ShieldCheck,
  Truck,
  Sparkles,
  Flame,
  Check,
  AlertCircle,
  Package,
  RotateCcw,
  Phone,
  Plus,
  Minus,
} from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../../api/endpoints";
import { useCartStore } from "../../store/cartStore";
import { useUIStore } from "../../store/uiStore";
import { ProductCard } from "../../components/product/ProductCard";
import { formatDZD } from "../../utils/formatters";

export const ProductDetail = () => {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [loading, setLoading] = useState(true);

  const addItem = useCartStore((state) => state.addItem);
  const openCart = useUIStore((state) => state.openCart);
  const setQuickOrderProduct = useUIStore((state) => state.setQuickOrderProduct);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.getProductBySlug(slug);
        if (res.data.data?.product) {
          const prod = res.data.data.product;
          setProduct(prod);
          setRelated(res.data.data.related || []);
          setSelectedImage(0);
          setQuantity(1);
          if (prod.variants && prod.variants.length > 0) {
            setSelectedVariant(prod.variants[0]);
          } else {
            setSelectedVariant(null);
          }
        }
      } catch (e) {
        console.error("Error fetching product:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
          <div className="h-96 bg-gray-200 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/4" />
            <div className="h-24 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto py-24 text-center px-4 space-y-4">
        <AlertCircle size={48} className="text-brand-rose mx-auto" />
        <h2 className="text-xl font-bold font-serif text-brand-navy">Produit non trouvé</h2>
        <p className="text-xs text-gray-500">
          Ce produit n'est plus disponible ou a été déplacé.
        </p>
        <Link
          to="/catalog"
          className="inline-block bg-brand-rose text-white px-6 py-2.5 rounded-xl font-bold text-xs"
        >
          Retourner au catalogue
        </Link>
      </div>
    );
  }

  const isPromo = product.salePrice && product.salePrice < product.price;
  const currentPrice = selectedVariant
    ? selectedVariant.price
    : isPromo
    ? product.salePrice
    : product.price;

  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;
  const isOutOfStock = currentStock <= 0;
  const isLowStock = currentStock > 0 && currentStock <= (product.lowStockThreshold || 5);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(product, quantity, selectedVariant);
    toast.success(
      i18n.language === "ar"
        ? `تمت إضافة "${product.name?.ar || product.name?.fr}" إلى السلة`
        : `"${product.name?.fr}" ajouté au panier`
    );
    openCart();
  };

  const handleDirectBuy = () => {
    if (isOutOfStock) return;
    setQuickOrderProduct(product);
  };

  const images =
    product.images?.length > 0
      ? product.images
      : ["https://images.unsplash.com/photo-1615865417491-9941019fbc00?w=800"];

  return (
    <>
      <Helmet>
        <title>{`${product.name?.fr || "Produit"} | Dari Belle Tiaret`}</title>
        <meta
          name="description"
          content={product.description?.fr?.slice(0, 160) || "Vaisselle de luxe à Tiaret"}
        />
      </Helmet>

      {/* Breadcrumb */}
      <div className="bg-brand-cream/50 py-3 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-xs text-gray-500 flex items-center gap-2">
          <Link to="/" className="hover:text-brand-navy">
            {t("nav.home")}
          </Link>
          <span>/</span>
          <Link to="/catalog" className="hover:text-brand-navy">
            {t("nav.catalog")}
          </Link>
          <span>/</span>
          {product.category && (
            <>
              <Link
                to={`/catalog?category=${product.category.slug}`}
                className="hover:text-brand-navy"
              >
                {product.category.name?.fr}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-brand-navy font-bold truncate max-w-xs">
            {i18n.language === "ar" && product.name?.ar
              ? product.name.ar
              : product.name?.fr}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Product Images Gallery */}
          <div className="space-y-4">
            {/* Main Image with house badge/arch framing */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-lg">
              <img
                src={images[selectedImage]}
                alt={product.name?.fr}
                className="w-full h-full object-cover object-center"
              />

              {/* Badges overlay */}
              <div className="absolute top-4 start-4 flex flex-col gap-2">
                {isPromo && (
                  <span className="bg-brand-rose text-white text-xs font-bold px-3 py-1.5 rounded-full shadow flex items-center gap-1">
                    <Flame size={14} />
                    <span>
                      -
                      {Math.round(
                        ((product.price - product.salePrice) / product.price) * 100
                      )}
                      %
                    </span>
                  </span>
                )}
                {product.tags?.includes("bestseller") && (
                  <span className="bg-brand-yellow text-brand-navy text-xs font-extrabold uppercase px-3 py-1 rounded-full shadow">
                    {t("common.tagBestseller")}
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail selector */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImage === idx
                        ? "border-brand-rose ring-2 ring-brand-rose/20 scale-105"
                        : "border-gray-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Vue ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details & Purchase Form */}
          <div className="space-y-6">
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-rose mb-1">
                <span>{product.brand?.name || "Dari Belle Prestige"}</span>
                <span>•</span>
                <span className="text-gray-400">SKU: {product.sku}</span>
              </div>

              <h1 className="text-2xl md:text-3xl font-serif font-bold text-brand-navy leading-snug">
                {i18n.language === "ar" && product.name?.ar
                  ? product.name.ar
                  : product.name?.fr}
              </h1>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-brand-cream/80 border border-amber-200/50 flex items-baseline gap-4">
              <span className="text-3xl font-black text-brand-rose">
                {formatDZD(currentPrice, i18n.language === "ar")}
              </span>
              {isPromo && (
                <span className="text-base text-gray-500 line-through">
                  {formatDZD(product.price, i18n.language === "ar")}
                </span>
              )}
            </div>

            {/* Stock status indicator */}
            <div className="flex items-center gap-2 text-xs">
              {isOutOfStock ? (
                <span className="inline-flex items-center gap-1.5 font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200">
                  <AlertCircle size={15} />
                  {t("product.outOfStock")}
                </span>
              ) : isLowStock ? (
                <span className="inline-flex items-center gap-1.5 font-bold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                  <AlertCircle size={15} />
                  {t("product.lowStockWarning", { count: currentStock })}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                  <Check size={15} />
                  {t("product.inStock")}
                </span>
              )}
            </div>

            {/* Variants Selector if any */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy">
                  Choisir une variante :
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.sku}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                        selectedVariant?.sku === variant.sku
                          ? "border-brand-rose bg-brand-rose text-white shadow"
                          : "border-gray-200 bg-white text-brand-navy hover:bg-gray-50"
                      }`}
                    >
                      {variant.name} — {formatDZD(variant.price, i18n.language === "ar")}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-navy">
                  Quantité :
                </span>
                <div className="flex items-center border border-gray-200 rounded-xl bg-white shadow-sm">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2.5 hover:text-brand-rose transition-colors"
                  >
                    <Minus size={15} />
                  </button>
                  <span className="px-4 text-sm font-bold text-brand-navy">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(currentStock || 99, q + 1))}
                    className="p-2.5 hover:text-brand-rose transition-colors"
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>

              {/* Main CTAs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="w-full bg-brand-navy hover:bg-brand-darkNavy text-white py-4 px-6 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  <ShoppingBag size={18} />
                  <span>{t("product.addToCart")}</span>
                </button>

                <button
                  onClick={handleDirectBuy}
                  disabled={isOutOfStock}
                  className="w-full bg-brand-rose hover:bg-[#b81f42] text-white py-4 px-6 rounded-2xl font-bold text-sm shadow-xl shadow-brand-rose/25 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 animate-pulse"
                >
                  <Zap size={18} className="fill-current" />
                  <span>{t("product.buyNow")}</span>
                </button>
              </div>
            </div>

            {/* Trust assurances box */}
            <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm space-y-3 text-xs text-gray-600">
              <div className="flex items-center gap-2.5">
                <Truck size={18} className="text-brand-rose shrink-0" />
                <span>
                  <strong>Livraison dans les 58 Wilayas :</strong> Délai 24h à Tiaret, 2 à 4 jours sur le reste de l'Algérie.
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={18} className="text-brand-teal shrink-0" />
                <span>
                  <strong>Paiement à la livraison :</strong> Vous vérifiez votre commande avant de payer en espèces.
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Package size={18} className="text-amber-600 shrink-0" />
                <span>
                  <strong>Emballage anti-casse renforcé :</strong> Carton double cannelure et papier bulle haute protection.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs */}
        <div className="mt-16 border-t border-gray-200 pt-10">
          <div className="flex items-center gap-4 border-b border-gray-200 pb-4 overflow-x-auto text-xs md:text-sm font-bold">
            <button
              onClick={() => setActiveTab("description")}
              className={`pb-2 transition-colors relative whitespace-nowrap ${
                activeTab === "description"
                  ? "text-brand-rose border-b-2 border-brand-rose font-black"
                  : "text-gray-500 hover:text-brand-navy"
              }`}
            >
              {t("product.description")}
            </button>

            <button
              onClick={() => setActiveTab("specs")}
              className={`pb-2 transition-colors relative whitespace-nowrap ${
                activeTab === "specs"
                  ? "text-brand-rose border-b-2 border-brand-rose font-black"
                  : "text-gray-500 hover:text-brand-navy"
              }`}
            >
              {t("product.specs")}
            </button>

            <button
              onClick={() => setActiveTab("care")}
              className={`pb-2 transition-colors relative whitespace-nowrap ${
                activeTab === "care"
                  ? "text-brand-rose border-b-2 border-brand-rose font-black"
                  : "text-gray-500 hover:text-brand-navy"
              }`}
            >
              {t("product.care")}
            </button>

            <button
              onClick={() => setActiveTab("delivery")}
              className={`pb-2 transition-colors relative whitespace-nowrap ${
                activeTab === "delivery"
                  ? "text-brand-rose border-b-2 border-brand-rose font-black"
                  : "text-gray-500 hover:text-brand-navy"
              }`}
            >
              {t("product.deliveryInfo")}
            </button>
          </div>

          <div className="py-6 text-sm text-gray-700 leading-relaxed max-w-3xl">
            {activeTab === "description" && (
              <div className="space-y-4">
                <p>
                  {i18n.language === "ar" && product.description?.ar
                    ? product.description.ar
                    : product.description?.fr}
                </p>
              </div>
            )}

            {activeTab === "specs" && (
              <div className="rounded-2xl border border-gray-100 overflow-hidden">
                <table className="w-full text-xs text-start">
                  <tbody className="divide-y divide-gray-100">
                    {product.attributes &&
                      Object.entries(product.attributes).map(([key, val]) => (
                        <tr key={key} className="even:bg-gray-50">
                          <td className="py-2.5 px-4 font-bold text-brand-navy w-1/3">
                            {key}
                          </td>
                          <td className="py-2.5 px-4 text-gray-600">{val}</td>
                        </tr>
                      ))}
                    <tr className="even:bg-gray-50">
                      <td className="py-2.5 px-4 font-bold text-brand-navy">Référence SKU</td>
                      <td className="py-2.5 px-4 text-gray-600 font-mono">{product.sku}</td>
                    </tr>
                    <tr className="even:bg-gray-50">
                      <td className="py-2.5 px-4 font-bold text-brand-navy">Disponibilité</td>
                      <td className="py-2.5 px-4 text-emerald-700 font-bold">
                        En stock au magasin Dari Belle Tiaret
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "care" && (
              <div className="p-5 rounded-2xl bg-brand-lightYellow border border-amber-200/60 space-y-2 text-xs text-amber-900">
                <h4 className="font-bold text-sm text-brand-navy">
                  Conseils de préservation de votre vaisselle de luxe :
                </h4>
                <p>{t("product.careTips")}</p>
                <p>
                  Pour les casseroles granite : ne jamais utiliser d'ustensiles métalliques pointus. Privilégier les spatules en silicone ou bois.
                </p>
              </div>
            )}

            {activeTab === "delivery" && (
              <div className="space-y-3 text-xs text-gray-600">
                <p>
                  <strong>Expédition nationale :</strong> Nos colis sont traités sous 24h ouvrées. Nous livrons sur l'ensemble des 58 Wilayas d'Algérie par messagerie express.
                </p>
                <p>
                  <strong>Garantie Casse :</strong> Si un article arrive endommagé lors du transport, contactez-nous immédiatement avec photo au 06 59 40 84 03. Le remplacement ou remboursement est assuré à 100%.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-16 border-t border-gray-200 pt-10">
            <h3 className="text-xl font-serif font-bold text-brand-navy mb-8">
              {t("product.related")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {related.map((rel) => (
                <ProductCard key={rel._id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
