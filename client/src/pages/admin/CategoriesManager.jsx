import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Plus, Edit, Trash2, Layers } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../../api/endpoints";
import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

export const CategoriesManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [nameFr, setNameFr] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState("");
  const [order, setOrder] = useState("0");
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.getCategories();
      if (res.data.data) setCategories(res.data.data);
    } catch (e) {
      toast.error("Erreur de chargement des catégories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreate = () => {
    setEditingCategory(null);
    setNameFr("");
    setNameAr("");
    setSlug("");
    setImage("");
    setOrder("0");
    setModalOpen(true);
  };

  const openEdit = (cat) => {
    setEditingCategory(cat);
    setNameFr(cat.name?.fr || "");
    setNameAr(cat.name?.ar || "");
    setSlug(cat.slug || "");
    setImage(cat.image || "");
    setOrder(cat.order?.toString() || "0");
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: { fr: nameFr, ar: nameAr || nameFr },
        slug: slug || undefined,
        image,
        order: Number(order) || 0,
      };

      if (editingCategory) {
        await api.updateCategory(editingCategory._id, payload);
        toast.success("Catégorie mise à jour !");
      } else {
        await api.createCategory(payload);
        toast.success("Catégorie créée !");
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette catégorie ?")) return;
    try {
      await api.deleteCategory(id);
      toast.success("Catégorie supprimée.");
      fetchCategories();
    } catch (e) {
      toast.error("Erreur lors de la suppression.");
    }
  };

  return (
    <>
      <Helmet>
        <title>Gestion des Catégories | Dari Belle Tiaret</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold text-brand-navy">
              Catégories & Univers
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Organisez les rayons de vaisselle, marmites, couverts et décoration.
            </p>
          </div>

          <Button variant="primary" size="md" onClick={openCreate}>
            <Plus size={16} />
            <span>Nouvelle Catégorie</span>
          </Button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-start text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold border-b">
              <tr>
                <th className="py-3 px-4 text-start">Image</th>
                <th className="py-3 px-4 text-start">Nom (FR)</th>
                <th className="py-3 px-4 text-start">Nom (AR)</th>
                <th className="py-3 px-4 text-start">Slug</th>
                <th className="py-3 px-4 text-start">Ordre</th>
                <th className="py-3 px-4 text-end">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((c) => (
                <tr key={c._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <img
                      src={c.image || "https://images.unsplash.com/photo-1615865417491-9941019fbc00?w=100"}
                      alt={c.name?.fr}
                      className="w-10 h-10 rounded-lg object-cover border"
                    />
                  </td>
                  <td className="py-3 px-4 font-bold text-brand-navy">{c.name?.fr}</td>
                  <td className="py-3 px-4 text-brand-navy" dir="rtl">{c.name?.ar}</td>
                  <td className="py-3 px-4 font-mono text-gray-500">{c.slug}</td>
                  <td className="py-3 px-4 font-bold">{c.order || 0}</td>
                  <td className="py-3 px-4 text-end space-x-1">
                    <button
                      onClick={() => openEdit(c)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCategory ? "Modifier la Catégorie" : "Créer une Catégorie"}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-start text-xs">
          <Input
            label="Nom en Français *"
            value={nameFr}
            onChange={(e) => setNameFr(e.target.value)}
            required
          />
          <Input
            label="Nom en Arabe"
            value={nameAr}
            onChange={(e) => setNameAr(e.target.value)}
            dir="rtl"
          />
          <Input
            label="Identifiant Slug (ex: services-de-table)"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
          <Input
            label="URL de l'image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://..."
          />
          <Input
            label="Ordre d'affichage"
            type="number"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
          />
          <Button type="submit" variant="primary" size="lg" className="w-full" loading={saving}>
            Enregistrer
          </Button>
        </form>
      </Modal>
    </>
  );
};
