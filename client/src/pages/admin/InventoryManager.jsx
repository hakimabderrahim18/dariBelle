import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  Boxes,
  FileSpreadsheet,
  Upload,
  Plus,
  ArrowDownRight,
  ArrowUpRight,
  History,
  AlertTriangle,
  RefreshCw,
  Check,
  Filter,
  Layers,
} from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../../api/endpoints";
import { formatDZD, formatDate } from "../../utils/formatters";
import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

const EXPORT_ATTRIBUTE_GROUPS = [
  {
    title: "Identification & Références",
    fields: [
      { key: "sku", label: "SKU / Référence", description: "Identifiant article unique" },
      { key: "nameFr", label: "Nom du Produit (FR)", description: "Désignation en français" },
      { key: "nameAr", label: "Nom du Produit (AR)", description: "Désignation en arabe" },
      { key: "category", label: "Catégorie", description: "Nom de la catégorie" },
      { key: "brand", label: "Marque", description: "Marque ou fabricant" },
      { key: "isPublished", label: "Statut Publié", description: "En ligne / Brouillon" },
    ],
  },
  {
    title: "Tarification & Ventes",
    fields: [
      { key: "purchasePrice", label: "Prix d'Achat (DZD)", description: "Coût de revient fournisseur" },
      { key: "price", label: "Prix de Vente (DZD)", description: "Prix catalogue standard" },
      { key: "salePrice", label: "Prix Promo (DZD)", description: "Prix promotionnel si actif" },
      { key: "soldCount", label: "Total Ventes", description: "Nombre total d'unités vendues" },
    ],
  },
  {
    title: "Gestion des Stocks",
    fields: [
      { key: "stock", label: "Stock Actuel", description: "Quantité en rayon / showroom" },
      { key: "lowStockThreshold", label: "Seuil d'Alerte", description: "Seuil déclencheur de réassort" },
      { key: "stockStatus", label: "État du Stock", description: "En Stock / Faible / Rupture" },
    ],
  },
  {
    title: "Caractéristiques & Historique",
    fields: [
      { key: "tags", label: "Badges & Tags", description: "Nouveauté, Populaire, etc." },
      { key: "attributes", label: "Attributs Techniques", description: "Matière, Pièces, Finition..." },
      { key: "createdAt", label: "Date d'Ajout", description: "Date de création du produit" },
    ],
  },
];

const DEFAULT_EXPORT_FIELDS = [
  "sku",
  "nameFr",
  "category",
  "brand",
  "purchasePrice",
  "price",
  "stock",
  "stockStatus",
];

const ALL_EXPORT_FIELDS = EXPORT_ATTRIBUTE_GROUPS.flatMap((g) => g.fields.map((f) => f.key));

export const InventoryManager = () => {
  const [inventory, setInventory] = useState(null);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [movementModalOpen, setMovementModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);

  // Custom Excel Export state
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [selectedExportFields, setSelectedExportFields] = useState(DEFAULT_EXPORT_FIELDS);
  const [exportStatusFilter, setExportStatusFilter] = useState("all");
  const [isExporting, setIsExporting] = useState(false);

  // Movement form state
  const [selectedProductId, setSelectedProductId] = useState("");
  const [movementType, setMovementType] = useState("in");
  const [quantity, setQuantity] = useState("1");
  const [reason, setReason] = useState("");
  const [reference, setReference] = useState("");
  const [submittingMovement, setSubmittingMovement] = useState(false);

  // CSV upload state
  const [csvFile, setCsvFile] = useState(null);
  const [importing, setImporting] = useState(false);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const [invRes, movRes] = await Promise.all([
        api.getInventory({ status: statusFilter !== "all" ? statusFilter : undefined }),
        api.getStockMovements({ limit: 20 }),
      ]);
      if (invRes.data.data) setInventory(invRes.data.data);
      if (movRes.data.data) setMovements(movRes.data.data);
    } catch (e) {
      console.error(e);
      toast.error("Erreur lors de la récupération de l'inventaire.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [statusFilter]);

  const handleRecordMovement = async (e) => {
    e.preventDefault();
    if (!selectedProductId || !quantity || !reason) {
      toast.error("Veuillez renseigner le produit, la quantité et le motif.");
      return;
    }

    setSubmittingMovement(true);
    try {
      await api.addStockMovement({
        productId: selectedProductId,
        type: movementType,
        quantity: Number(quantity),
        reason,
        reference,
      });
      toast.success("Mouvement de stock enregistré !");
      setMovementModalOpen(false);
      setReason("");
      setReference("");
      fetchInventory();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de l'enregistrement.");
    } finally {
      setSubmittingMovement(false);
    }
  };

  const handleImportCsv = async (e) => {
    e.preventDefault();
    if (!csvFile) {
      toast.error("Veuillez sélectionner un fichier CSV.");
      return;
    }

    const formData = new FormData();
    formData.append("file", csvFile);

    setImporting(true);
    try {
      const res = await api.importInventoryCsv(formData);
      toast.success(`Import terminé : ${res.data.data?.updatedCount || 0} références mises à jour !`);
      setImportModalOpen(false);
      setCsvFile(null);
      fetchInventory();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de l'import CSV.");
    } finally {
      setImporting(false);
    }
  };

  const toggleExportField = (key) => {
    setSelectedExportFields((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleSelectAllExportFields = () => {
    setSelectedExportFields(ALL_EXPORT_FIELDS);
  };

  const handleDeselectAllExportFields = () => {
    setSelectedExportFields([]);
  };

  const handleResetDefaultExportFields = () => {
    setSelectedExportFields(DEFAULT_EXPORT_FIELDS);
  };

  const handleDownloadCustomExcel = async () => {
    if (selectedExportFields.length === 0) {
      toast.error("Veuillez sélectionner au moins une colonne à exporter.");
      return;
    }

    setIsExporting(true);
    const toastId = toast.loading("Génération du document Excel personnalisé...");
    try {
      const params = {
        fields: selectedExportFields.join(","),
        status: exportStatusFilter !== "all" ? exportStatusFilter : undefined,
      };
      const response = await api.exportInventoryBlob(params);
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const dateStr = new Date().toISOString().split("T")[0];
      link.setAttribute("download", `inventaire-daribelle-${dateStr}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Document Excel exporté avec succès !", { id: toastId });
      setExportModalOpen(false);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Erreur lors de la génération du fichier Excel.", { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  const summary = inventory?.summary || {};
  const products = inventory?.products || [];

  return (
    <>
      <Helmet>
        <title>Inventaire & Mouvements de Stock | Dari Belle Tiaret</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header & Main Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-brand-navy">
              Gestion des Stocks & Inventaire
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Traçabilité des entrées/sorties fournisseurs, valorisation du stock et exports Excel personnalisables.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Record movement */}
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setSelectedProductId(products[0]?._id || "");
                setMovementModalOpen(true);
              }}
            >
              <Plus size={16} />
              <span>Mouvement de Stock</span>
            </Button>

            {/* Export Excel (Customizable) */}
            <Button
              variant="outline"
              size="md"
              onClick={() => setExportModalOpen(true)}
              className="bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 hover:border-emerald-400 font-bold"
            >
              <FileSpreadsheet size={16} className="text-emerald-700" />
              <span>Exporter Excel (.xlsx)</span>
            </Button>

            {/* Import CSV */}
            <Button
              variant="outline"
              size="md"
              onClick={() => setImportModalOpen(true)}
            >
              <Upload size={16} />
              <span>Importer CSV</span>
            </Button>
          </div>
        </div>

        {/* Valuation KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase">Unités Totales</span>
            <div className="text-2xl font-black text-brand-navy">{summary.totalStockUnits || 0}</div>
            <p className="text-[11px] text-gray-500">Articles disponibles au showroom</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase">Valeur Achat du Stock</span>
            <div className="text-2xl font-black text-brand-navy">{formatDZD(summary.totalPurchaseValue || 0)}</div>
            <p className="text-[11px] text-gray-500">Coût d'acquisition global</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase">Valeur Marchande (Vente)</span>
            <div className="text-2xl font-black text-brand-rose">{formatDZD(summary.totalRetailValue || 0)}</div>
            <p className="text-[11px] text-gray-500">Chiffre d'affaires potentiel</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase">Alertes Réapprovisionnement</span>
            <div className="text-2xl font-black text-amber-700">
              {(summary.lowStockCount || 0) + (summary.outOfStockCount || 0)}
            </div>
            <p className="text-[11px] text-gray-500">
              {summary.outOfStockCount || 0} ruptures / {summary.lowStockCount || 0} stocks faibles
            </p>
          </div>
        </div>

        {/* Products Table with Stock Highlights */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Boxes size={18} className="text-brand-rose" />
              <h3 className="font-serif font-bold text-sm text-brand-navy">
                État des Stocks Magasin
              </h3>
            </div>

            <div className="flex gap-1.5 text-xs font-bold">
              {[
                { id: "all", label: "Tous" },
                { id: "low", label: "Stock Faible" },
                { id: "out", label: "Rupture" },
                { id: "in_stock", label: "En Stock" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    statusFilter === tab.id
                      ? "bg-brand-rose text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold border-b">
                <tr>
                  <th className="py-3 px-4 text-start">Article</th>
                  <th className="py-3 px-4 text-start">SKU</th>
                  <th className="py-3 px-4 text-start">Prix Achat</th>
                  <th className="py-3 px-4 text-start">Prix Vente</th>
                  <th className="py-3 px-4 text-start">Stock Actuel</th>
                  <th className="py-3 px-4 text-start">Seuil Min</th>
                  <th className="py-3 px-4 text-start">État</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-400">
                      Chargement de l'inventaire...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-400">
                      Aucun article pour ce filtre.
                    </td>
                  </tr>
                ) : (
                  products.map((p) => {
                    const isOut = p.stock <= 0;
                    const isLow = p.stock > 0 && p.stock <= (p.lowStockThreshold || 5);

                    return (
                      <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 font-bold text-brand-navy">{p.name?.fr}</td>
                        <td className="py-3 px-4 font-mono text-gray-600">{p.sku}</td>
                        <td className="py-3 px-4 text-gray-600">{formatDZD(p.purchasePrice || 0)}</td>
                        <td className="py-3 px-4 font-bold text-brand-rose">{formatDZD(p.price)}</td>
                        <td className="py-3 px-4 font-extrabold text-sm">{p.stock}</td>
                        <td className="py-3 px-4 text-gray-500">{p.lowStockThreshold || 5}</td>
                        <td className="py-3 px-4">
                          {isOut ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
                              Rupture
                            </span>
                          ) : isLow ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              Stock Faible
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              Normal
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Movements History */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <History size={18} className="text-brand-teal" />
            <h3 className="font-serif font-bold text-base text-brand-navy">
              Derniers Mouvements de Stock (Traçabilité)
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold border-b">
                <tr>
                  <th className="py-2.5 px-4 text-start">Date</th>
                  <th className="py-2.5 px-4 text-start">Article</th>
                  <th className="py-2.5 px-4 text-start">Type</th>
                  <th className="py-2.5 px-4 text-start">Quantité</th>
                  <th className="py-2.5 px-4 text-start">Avant → Après</th>
                  <th className="py-2.5 px-4 text-start">Motif / Réf</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {movements.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400">
                      Aucun mouvement récent enregistré.
                    </td>
                  </tr>
                ) : (
                  movements.map((m) => (
                    <tr key={m._id} className="hover:bg-gray-50">
                      <td className="py-2.5 px-4 text-gray-500">{formatDate(m.createdAt)}</td>
                      <td className="py-2.5 px-4 font-bold text-brand-navy">{m.product?.name?.fr || "-"}</td>
                      <td className="py-2.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            m.type === "in" || m.type === "return"
                              ? "bg-emerald-100 text-emerald-800"
                              : m.type === "out"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {m.type === "in" ? "Entrée (+)" : m.type === "out" ? "Sortie (-)" : m.type === "return" ? "Retour (+)" : "Ajustement"}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 font-black">{m.quantity}</td>
                      <td className="py-2.5 px-4 text-gray-600 font-mono">
                        {m.stockBefore} → {m.stockAfter}
                      </td>
                      <td className="py-2.5 px-4 text-gray-600">
                        {m.reason} {m.reference && `(${m.reference})`}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Record Movement Modal */}
      <Modal
        isOpen={movementModalOpen}
        onClose={() => setMovementModalOpen(false)}
        title="Enregistrer un Mouvement de Stock"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleRecordMovement} className="space-y-4 text-start text-xs">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-navy mb-1.5">
              Article *
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full rounded-xl border p-2.5 outline-none focus:border-brand-rose"
              required
            >
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name?.fr} ({p.sku}) — Stock actuel: {p.stock}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-navy mb-1.5">
              Type d'opération *
            </label>
            <select
              value={movementType}
              onChange={(e) => setMovementType(e.target.value)}
              className="w-full rounded-xl border p-2.5 outline-none focus:border-brand-rose"
            >
              <option value="in">Entrée de Stock (Réception Fournisseur)</option>
              <option value="out">Sortie de Stock (Vente physique, casse, perte)</option>
              <option value="adjustment">Ajustement d'inventaire (Définir le stock exact)</option>
              <option value="return">Retour Client</option>
            </select>
          </div>

          <Input
            label="Quantité *"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            min="1"
          />

          <Input
            label="Motif de l'opération *"
            placeholder="Ex: Arrivage conteneur porcelaine, inventaire physique annuel..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />

          <Input
            label="Référence (Bon de livraison, n° facture fournisseur)"
            placeholder="Ex: BL-2026-TURKEY-01"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />

          <Button type="submit" variant="primary" size="lg" className="w-full" loading={submittingMovement}>
            Valider le mouvement
          </Button>
        </form>
      </Modal>

      {/* Import CSV Modal */}
      <Modal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        title="Importer l'Inventaire par Fichier CSV"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleImportCsv} className="space-y-4 text-start text-xs">
          <div className="p-3 bg-brand-cream rounded-xl border border-amber-200/50 space-y-1 text-gray-600">
            <p className="font-bold text-brand-navy">Format de fichier attendu :</p>
            <p>Le fichier CSV doit comporter les colonnes : <code>sku</code>, <code>stock</code>.</p>
            <p className="text-[11px] text-gray-500">Exemple : <code>DB-PORC-84P-01,25</code></p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-navy mb-1.5">
              Sélectionnez le fichier CSV
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
              className="w-full border rounded-xl p-2.5 bg-gray-50"
              required
            />
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full" loading={importing}>
            Lancer l'importation
          </Button>
        </form>
      </Modal>

      {/* Export Excel Customization Modal */}
      <Modal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        title="Exporter l'Inventaire en Fichier Excel (.xlsx)"
        maxWidth="max-w-2xl"
      >
        <div className="space-y-5 text-start">
          {/* Informational Header */}
          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200/80 flex items-start gap-3">
            <FileSpreadsheet className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-950 space-y-1">
              <p className="font-bold">Choix des attributs pour le document Excel</p>
              <p className="text-emerald-800">
                Sélectionnez les colonnes à inclure dans le fichier généré. Le fichier Excel comportera des en-têtes élégants et un code couleur selon l'état des stocks.
              </p>
            </div>
          </div>

          {/* Stock Filter Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-navy mb-2">
              Périmètre des articles à exporter :
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "all", label: "Tous les articles" },
                { value: "in-stock", label: "En stock uniquement" },
                { value: "low-stock", label: "Stock faible & Rupture" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setExportStatusFilter(opt.value)}
                  className={`py-2 px-3 text-xs rounded-xl font-medium border text-center transition-all ${
                    exportStatusFilter === opt.value
                      ? "bg-emerald-700 text-white border-emerald-700 shadow-sm"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Bar for selection */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2.5">
            <div className="text-xs font-bold text-gray-700">
              Colonnes sélectionnées :{" "}
              <span className="text-emerald-700 font-mono">
                {selectedExportFields.length} / {ALL_EXPORT_FIELDS.length}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <button
                type="button"
                onClick={handleSelectAllExportFields}
                className="text-emerald-700 hover:underline font-semibold"
              >
                Tout cocher
              </button>
              <span className="text-gray-300">•</span>
              <button
                type="button"
                onClick={handleResetDefaultExportFields}
                className="text-gray-600 hover:underline font-semibold"
              >
                Par défaut
              </button>
              <span className="text-gray-300">•</span>
              <button
                type="button"
                onClick={handleDeselectAllExportFields}
                className="text-gray-500 hover:underline"
              >
                Tout décocher
              </button>
            </div>
          </div>

          {/* Categorized Attribute Checkboxes */}
          <div className="max-h-[320px] overflow-y-auto pr-1 space-y-4">
            {EXPORT_ATTRIBUTE_GROUPS.map((group) => (
              <div key={group.title} className="space-y-2">
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  {group.title}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {group.fields.map((f) => {
                    const isChecked = selectedExportFields.includes(f.key);
                    return (
                      <label
                        key={f.key}
                        onClick={(e) => {
                          e.preventDefault();
                          toggleExportField(f.key);
                        }}
                        className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer select-none transition-all ${
                          isChecked
                            ? "bg-emerald-50/60 border-emerald-300 shadow-xs"
                            : "bg-white border-gray-200 hover:bg-gray-50 opacity-80"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="mt-0.5 rounded text-emerald-700 focus:ring-emerald-500 accent-emerald-700"
                        />
                        <div className="text-xs">
                          <p className={`font-semibold ${isChecked ? "text-emerald-950" : "text-gray-700"}`}>
                            {f.label}
                          </p>
                          <p className="text-[11px] text-gray-400">{f.description}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t">
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => setExportModalOpen(false)}
            >
              Annuler
            </Button>
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleDownloadCustomExcel}
              loading={isExporting}
              disabled={selectedExportFields.length === 0}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
            >
              <FileSpreadsheet size={16} />
              <span>Télécharger le Fichier (.xlsx)</span>
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
