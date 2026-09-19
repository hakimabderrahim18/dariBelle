import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../../api/endpoints";
import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

export const HeroSlidesManager = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);

  const [titleFr, setTitleFr] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [subtitleFr, setSubtitleFr] = useState("");
  const [subtitleAr, setSubtitleAr] = useState("");
  const [badge, setBadge] = useState("");
  const [desktopImg, setDesktopImg] = useState("");
  const [ctaLabel, setCtaLabel] = useState("Explorer la Collection");
  const [ctaLink, setCtaLink] = useState("/catalog");
  const [order, setOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSlides = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminSlides();
      if (res.data.data) setSlides(res.data.data);
    } catch (e) {
      toast.error("Erreur de chargement des bannières.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const openCreate = () => {
    setEditingSlide(null);
    setTitleFr("");
    setTitleAr("");
    setSubtitleFr("");
    setSubtitleAr("");
    setBadge("");
    setDesktopImg("");
    setCtaLabel("Explorer la Collection");
    setCtaLink("/catalog");
    setOrder("0");
    setIsActive(true);
    setModalOpen(true);
  };

  const openEdit = (s) => {
    setEditingSlide(s);
    setTitleFr(s.title?.fr || "");
    setTitleAr(s.title?.ar || "");
    setSubtitleFr(s.subtitle?.fr || "");
    setSubtitleAr(s.subtitle?.ar || "");
    setBadge(s.badge || "");
    setDesktopImg(s.image?.desktop || "");
    setCtaLabel(s.ctaLabel?.fr || "Explorer la Collection");
    setCtaLink(s.ctaLink || "/catalog");
    setOrder(s.order?.toString() || "0");
    setIsActive(s.isActive);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: { fr: titleFr, ar: titleAr || titleFr },
        subtitle: { fr: subtitleFr, ar: subtitleAr },
        badge,
        image: { desktop: desktopImg },
        ctaLabel: { fr: ctaLabel, ar: "اكتشف التشكيلة" },
        ctaLink,
        order: Number(order) || 0,
        isActive,
      };

      if (editingSlide) {
        await api.updateSlide(editingSlide._id, payload);
        toast.success("Bannière mise à jour !");
      } else {
        await api.createSlide(payload);
        toast.success("Bannière créée !");
      }
      setModalOpen(false);
      fetchSlides();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette diapositive ?")) return;
    try {
      await api.deleteSlide(id);
      toast.success("Diapositive supprimée.");
      fetchSlides();
    } catch (e) {
      toast.error("Erreur de suppression.");
    }
  };

  return (
    <>
      <Helmet>
        <title>Bannières d'Accueil | Dari Belle Tiaret</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold text-brand-navy">
              Bannières & Sliders d'Accueil
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Gérez les affiches promotionnelles et slogans sur la page d'accueil.
            </p>
          </div>

          <Button variant="primary" size="md" onClick={openCreate}>
            <Plus size={16} />
            <span>Ajouter une Bannière</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {slides.map((s) => (
            <div
              key={s._id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col"
            >
              <div className="relative h-44 bg-gray-100">
                <img
                  src={s.image?.desktop}
                  alt={s.title?.fr}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 end-3 flex gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      s.isActive ? "bg-emerald-600 text-white" : "bg-gray-600 text-white"
                    }`}
                  >
                    {s.isActive ? "Active" : "Désactivée"}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  {s.badge && (
                    <span className="text-[10px] font-bold uppercase text-brand-rose block">
                      {s.badge}
                    </span>
                  )}
                  <h3 className="font-serif font-bold text-base text-brand-navy">
                    {s.title?.fr}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                    {s.subtitle?.fr}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t text-xs">
                  <span className="text-gray-400">Ordre: {s.order}</span>
                  <div className="space-x-1">
                    <button
                      onClick={() => openEdit(s)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(s._id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingSlide ? "Modifier la Bannière" : "Nouvelle Bannière"}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-start text-xs">
          <Input
            label="Titre (Français) *"
            value={titleFr}
            onChange={(e) => setTitleFr(e.target.value)}
            required
          />
          <Input
            label="Titre (Arabe)"
            value={titleAr}
            onChange={(e) => setTitleAr(e.target.value)}
            dir="rtl"
          />
          <Input
            label="Sous-titre (Français)"
            value={subtitleFr}
            onChange={(e) => setSubtitleFr(e.target.value)}
          />
          <Input
            label="Badge (ex: NOUVELLE COLLECTION)"
            value={badge}
            onChange={(e) => setBadge(e.target.value)}
          />
          <Input
            label="URL Image Desktop *"
            value={desktopImg}
            onChange={(e) => setDesktopImg(e.target.value)}
            required
          />
          <Input
            label="Texte du bouton CTA"
            value={ctaLabel}
            onChange={(e) => setCtaLabel(e.target.value)}
          />
          <Input
            label="Lien CTA (ex: /catalog?tag=promo)"
            value={ctaLink}
            onChange={(e) => setCtaLink(e.target.value)}
          />
          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer font-bold">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="text-brand-rose rounded"
              />
              <span>Bannière active</span>
            </label>
            <div className="w-24">
              <Input
                label="Ordre"
                type="number"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
              />
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full" loading={saving}>
            Enregistrer
          </Button>
        </form>
      </Modal>
    </>
  );
};
