import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Truck, Edit, Check, Search } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../../api/endpoints";
import { formatDZD } from "../../utils/formatters";
import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

export const ShippingManager = () => {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editZone, setEditZone] = useState(null);
  const [fee, setFee] = useState("");
  const [deskFee, setDeskFee] = useState("");
  const [deliveryDays, setDeliveryDays] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchZones = async () => {
    setLoading(true);
    try {
      const res = await api.getShippingZones();
      if (res.data.data) setZones(res.data.data);
    } catch (e) {
      toast.error("Erreur de chargement des wilayas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchZones();
  }, []);

  const openEdit = (z) => {
    setEditZone(z);
    setFee(z.fee.toString());
    setDeskFee(z.deskFee?.toString() || "0");
    setDeliveryDays(z.deliveryDays || "2-3 jours");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editZone) return;

    setSaving(true);
    try {
      await api.updateShippingZone(editZone._id, {
        fee: Number(fee),
        deskFee: Number(deskFee),
        deliveryDays,
      });
      toast.success(`Frais mis à jour pour ${editZone.wilaya?.fr} !`);
      setEditZone(null);
      fetchZones();
    } catch (err) {
      toast.error("Erreur lors de la mise à jour.");
    } finally {
      setSaving(false);
    }
  };

  const filtered = zones.filter((z) => {
    const text = `${z.wilayaCode} ${z.wilaya?.fr} ${z.wilaya?.ar}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  return (
    <>
      <Helmet>
        <title>Frais de Livraison 58 Wilayas | Dari Belle Tiaret</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-brand-navy">
              Frais de Livraison (58 Wilayas d'Algérie)
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Personnalisez les tarifs à domicile et en point relais (Stop Desk) pour chaque wilaya.
            </p>
          </div>

          <div className="relative w-64">
            <Search size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher wilaya (ex: Tiaret)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-xl ps-9 pe-3 py-2 text-xs bg-white outline-none focus:border-brand-rose"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-start text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold border-b">
              <tr>
                <th className="py-3 px-4 text-start">Code</th>
                <th className="py-3 px-4 text-start">Wilaya (Français / Arabe)</th>
                <th className="py-3 px-4 text-start">Livraison Domicile</th>
                <th className="py-3 px-4 text-start">Stop Desk</th>
                <th className="py-3 px-4 text-start">Délai Estimé</th>
                <th className="py-3 px-4 text-end">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((z) => (
                <tr key={z._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono font-bold text-brand-navy">{z.wilayaCode}</td>
                  <td className="py-3 px-4 font-bold text-brand-navy">
                    {z.wilaya?.fr} <span className="text-gray-400">/</span> {z.wilaya?.ar}
                    {z.wilayaCode === 14 && (
                      <span className="ms-2 bg-brand-rose text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                        Siège Magasin
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-extrabold text-brand-rose">{formatDZD(z.fee)}</td>
                  <td className="py-3 px-4 font-semibold text-gray-600">{formatDZD(z.deskFee || 0)}</td>
                  <td className="py-3 px-4 text-gray-500">{z.deliveryDays}</td>
                  <td className="py-3 px-4 text-end">
                    <button
                      onClick={() => openEdit(z)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={!!editZone}
        onClose={() => setEditZone(null)}
        title={`Modifier les Frais - ${editZone?.wilaya?.fr}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSave} className="space-y-4 text-start text-xs">
          <Input
            label="Tarif Livraison à Domicile (DZD) *"
            type="number"
            value={fee}
            onChange={(e) => setFee(e.target.value)}
            required
          />

          <Input
            label="Tarif Stop Desk / Point Relais (DZD) *"
            type="number"
            value={deskFee}
            onChange={(e) => setDeskFee(e.target.value)}
            required
          />

          <Input
            label="Délai moyen de livraison"
            value={deliveryDays}
            onChange={(e) => setDeliveryDays(e.target.value)}
            placeholder="Ex: 24h - Express Tiaret ou 2-3 jours"
          />

          <Button type="submit" variant="primary" size="lg" className="w-full" loading={saving}>
            Enregistrer les modifications
          </Button>
        </form>
      </Modal>
    </>
  );
};
