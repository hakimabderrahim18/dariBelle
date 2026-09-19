import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Plus, Trash2, Tag, Percent, DollarSign } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../../api/endpoints";
import { formatDZD } from "../../utils/formatters";
import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

export const CouponsManager = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [code, setCode] = useState("");
  const [type, setType] = useState("percent");
  const [value, setValue] = useState("10");
  const [minOrder, setMinOrder] = useState("10000");
  const [usageLimit, setUsageLimit] = useState("100");
  const [saving, setSaving] = useState(false);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await api.getCoupons();
      if (res.data.data) setCoupons(res.data.data);
    } catch (e) {
      toast.error("Erreur de chargement des coupons.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.createCoupon({
        code: code.toUpperCase().trim(),
        type,
        value: Number(value),
        minOrder: Number(minOrder) || 0,
        usageLimit: Number(usageLimit) || null,
        isActive: true,
      });
      toast.success("Code promo créé !");
      setModalOpen(false);
      setCode("");
      fetchCoupons();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur de création.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce coupon ?")) return;
    try {
      await api.deleteCoupon(id);
      toast.success("Coupon supprimé.");
      fetchCoupons();
    } catch (e) {
      toast.error("Erreur.");
    }
  };

  return (
    <>
      <Helmet>
        <title>Codes Promo | Dari Belle Tiaret</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold text-brand-navy">
              Codes Promotionnels & Réductions
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Configurez des remises en pourcentage ou montant fixe pour vos campagnes.
            </p>
          </div>

          <Button variant="primary" size="md" onClick={() => setModalOpen(true)}>
            <Plus size={16} />
            <span>Nouveau Coupon</span>
          </Button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-start text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold border-b">
              <tr>
                <th className="py-3 px-4 text-start">Code</th>
                <th className="py-3 px-4 text-start">Type & Valeur</th>
                <th className="py-3 px-4 text-start">Commande Min</th>
                <th className="py-3 px-4 text-start">Utilisations</th>
                <th className="py-3 px-4 text-end">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {coupons.map((cp) => (
                <tr key={cp._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono font-bold text-brand-rose text-sm">
                    {cp.code}
                  </td>
                  <td className="py-3 px-4 font-bold">
                    {cp.type === "percent" ? `${cp.value}% de réduction` : `${formatDZD(cp.value)} fixe`}
                  </td>
                  <td className="py-3 px-4 text-gray-600">{formatDZD(cp.minOrder || 0)}</td>
                  <td className="py-3 px-4 text-gray-600">
                    {cp.usedCount} / {cp.usageLimit || "Illimité"}
                  </td>
                  <td className="py-3 px-4 text-end">
                    <button
                      onClick={() => handleDelete(cp._id)}
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
        title="Créer un Code Promo"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-start text-xs">
          <Input
            label="Code Promo (ex: TIARET2026) *"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            required
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-navy mb-1.5">
              Type de réduction *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType("percent")}
                className={`py-2 px-3 rounded-xl border text-xs font-bold ${
                  type === "percent" ? "bg-brand-rose text-white border-brand-rose" : "bg-gray-50"
                }`}
              >
                Pourcentage (%)
              </button>
              <button
                type="button"
                onClick={() => setType("fixed")}
                className={`py-2 px-3 rounded-xl border text-xs font-bold ${
                  type === "fixed" ? "bg-brand-rose text-white border-brand-rose" : "bg-gray-50"
                }`}
              >
                Montant Fixe (DZD)
              </button>
            </div>
          </div>

          <Input
            label={type === "percent" ? "Pourcentage (%) *" : "Montant de la remise (DZD) *"}
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
          />

          <Input
            label="Montant Minimum de Commande (DZD)"
            type="number"
            value={minOrder}
            onChange={(e) => setMinOrder(e.target.value)}
          />

          <Input
            label="Limite d'utilisations totales"
            type="number"
            value={usageLimit}
            onChange={(e) => setUsageLimit(e.target.value)}
          />

          <Button type="submit" variant="primary" size="lg" className="w-full" loading={saving}>
            Créer le code promo
          </Button>
        </form>
      </Modal>
    </>
  );
};
