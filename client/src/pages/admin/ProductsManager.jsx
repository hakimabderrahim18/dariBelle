import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  CheckCircle,
  AlertCircle,
  Package,
} from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../../api/endpoints";
import { formatDZD } from "../../utils/formatters";
import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

export const ProductsManager = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [nameFr, setNameFr] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [price, setPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [stock, setStock] = useState("");
  const [lowStockThreshold, setLowStockThreshold] = useState("5");
  const [imagesText, setImagesText] = useState("");
  const [descFr, setDescFr] = useState("");
  const [descAr, setDescAr] = useState("");
  const [tags, setTags] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.getProducts({ search, limit: 100 }),
        api.getCategories(),
      ]);
      if (prodRes.data.data) setProducts(prodRes.data.data);
      if (catRes.data.data) setCategories(catRes.data.data);
    } catch (e) {
      console.error(e);
      toast.error("Erreur lors du chargement des articles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setNameFr("");
    setNameAr("");
    setSku(`DB-${Date.now().toString().slice(-6)}`);
    setCategory(categories[0]?._id || "");
    setPurchasePrice("");
    setPrice("");
    setSalePrice("");
    setStock("10");
    setLowStockThreshold("5");
    setImagesText("");
    setDescFr("");
    setDescAr("");
    setTags([]);
    setModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingProduct(p);
    setNameFr(p.name?.fr || "");
    setNameAr(p.name?.ar || "");
    setSku(p.sku || "");
    setCategory(p.category?._id || p.category || "");
    setPurchasePrice(p.purchasePrice?.toString() || "");
    setPrice(p.price?.toString() || "");
    setSalePrice(p.salePrice ? p.salePrice.toString() : "");
    setStock(p.stock?.toString() || "0");
    setLowStockThreshold(p.lowStockThreshold?.toString() || "5");
    setImagesText(p.images?.join("\n") || "");
    setDescFr(p.description?.fr || "");
    setDescAr(p.description?.ar || "");
    setTags(p.tags || []);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nameFr || !sku || !category || !price) {
      toast.error("Veuillez remplir les champs obligatoires (Nom, SKU, Catégorie, Prix).");
      return;
    }

    const images = imagesText
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    const payload = {
      name: { fr: nameFr, ar: nameAr || nameFr },
      sku: sku.toUpperCase().trim(),
      category,
      purchasePrice: Number(purchasePrice) || 0,
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : null,
      stock: Number(stock) || 0,
      lowStockThreshold: Number(lowStockThreshold) || 5,
      images: images.length > 0 ? images : ["https://images.unsplash.com/photo-1615865417491-9941019fbc00?w=600"],
      description: { fr: descFr, ar: descAr },
      tags,
    };

    setSubmitting(true);
    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct._id, payload);
        toast.success("Produit modifié avec succès !");
      } else {
        await api.createProduct(payload);
        toast.success("Produit ajouté au catalogue !");
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur d'enregistrement.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet article du catalogue ?")) return;
    try {
      await api.deleteProduct(id);
      toast.success("Article supprimé.");
      fetchData();
    } catch (err) {
      toast.error("Erreur lors de la suppression.");
    }
  };

  return (
    <>
      <Helmet>
        <title>Gestion des Produits | Dari Belle Tiaret</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-brand-navy">
              Articles & Catalogue
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Gérez les fiches articles, prix, photos et seuils d'alerte de stock.
            </p>
          </div>

          <Button variant="primary" size="md" onClick={openCreateModal}>
            <Plus size={16} />
            <span>Nouveau Produit</span>
          </Button>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-sm w-full">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchData()}
              className="w-full text-xs outline-none bg-transparent"
            />
          </div>
          <button
            onClick={fetchData}
            className="text-xs font-bold text-brand-rose hover:underline"
          >
            Actualiser
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold border-b">
                <tr>
                  <th className="py-3.5 px-4 text-start">Article</th>
                  <th className="py-3.5 px-4 text-start">SKU</th>
                  <th className="py-3.5 px-4 text-start">Catégorie</th>
                  <th className="py-3.5 px-4 text-start">Prix Vente</th>
                  <th className="py-3.5 px-4 text-start">Stock</th>
                  <th className="py-3.5 px-4 text-start">Vendus</th>
                  <th className="py-3.5 px-4 text-end">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-400">
                      Chargement...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-400">
                      Aucun article trouvé.
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images?.[0] || "https://images.unsplash.com/photo-1615865417491-9941019fbc00?w=100"}
                            alt={p.name?.fr}
                            className="w-10 h-10 rounded-lg object-cover border"
                          />
                          <span className="font-bold text-brand-navy max-w-xs truncate">
                            {p.name?.fr}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-gray-600">{p.sku}</td>
                      <td className="py-3 px-4 text-gray-600">{p.category?.name?.fr || "-"}</td>
                      <td className="py-3 px-4 font-extrabold text-brand-rose">
                        {formatDZD(p.price)}
                        {p.salePrice && (
                          <span className="block text-[10px] text-emerald-600">
                            Promo: {formatDZD(p.salePrice)}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {p.stock <= 0 ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
                            Rupture (0)
                          </span>
                        ) : p.stock <= (p.lowStockThreshold || 5) ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            Faible ({p.stock})
                          </span>
                        ) : (
                          <span className="font-bold text-emerald-700">{p.stock}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-600">{p.soldCount || 0}</td>
                      <td className="py-3 px-4 text-end space-x-1">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Modifier"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProduct ? "Modifier l'Article" : "Ajouter un Nouvel Article"}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-start text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Nom du Produit (Français) *"
              value={nameFr}
              onChange={(e) => setNameFr(e.target.value)}
              required
            />
            <Input
              label="Nom du Produit (Arabe)"
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              dir="rtl"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Référence SKU *"
              value={sku}
              onChange={(e) => setSku(e.target.value.toUpperCase())}
              required
            />
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-navy mb-1.5">
                Catégorie *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 px-3.5 text-xs outline-none focus:border-brand-rose"
                required
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name?.fr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Prix d'Achat (DZD)"
              type="number"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
            />
            <Input
              label="Prix de Vente (DZD) *"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            <Input
              label="Prix Promo (Optionnel)"
              type="number"
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Quantité en Stock *"
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
            />
            <Input
              label="Seuil d'Alerte Stock Faible"
              type="number"
              value={lowStockThreshold}
              onChange={(e) => setLowStockThreshold(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-navy mb-1.5">
              URLs des Photos (Une URL par ligne)
            </label>
            <textarea
              rows={3}
              value={imagesText}
              onChange={(e) => setImagesText(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-brand-rose font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-navy mb-1.5">
                Description (Français)
              </label>
              <textarea
                rows={3}
                value={descFr}
                onChange={(e) => setDescFr(e.target.value)}
                className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-brand-rose"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-navy mb-1.5">
                Description (Arabe)
              </label>
              <textarea
                rows={3}
                value={descAr}
                onChange={(e) => setDescAr(e.target.value)}
                dir="rtl"
                className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-brand-rose"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-navy mb-1.5">
              Badges & Mises en avant
            </label>
            <div className="flex gap-4">
              {["new", "promo", "bestseller"].map((tg) => (
                <label key={tg} className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tags.includes(tg)}
                    onChange={(e) => {
                      if (e.target.checked) setTags([...tags, tg]);
                      else setTags(tags.filter((t) => t !== tg));
                    }}
                    className="text-brand-rose rounded"
                  />
                  <span className="capitalize">{tg}</span>
                </label>
              ))}
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full" loading={submitting}>
            {editingProduct ? "Enregistrer les modifications" : "Créer le produit"}
          </Button>
        </form>
      </Modal>
    </>
  );
};
