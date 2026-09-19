import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  Search,
  FileText,
  Eye,
  CheckCircle,
  Truck,
  XCircle,
  Clock,
  RotateCcw,
  Download,
} from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../../api/endpoints";
import { formatDZD, formatDate } from "../../utils/formatters";
import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";

export const OrdersManager = () => {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusModalOrder, setStatusModalOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("confirmed");
  const [statusNote, setStatusNote] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminOrders({
        status: statusFilter !== "all" ? statusFilter : undefined,
        search: search || undefined,
        limit: 50,
      });
      if (res.data.data) {
        setOrders(res.data.data);
        setTotal(res.data.meta?.total || 0);
      }
    } catch (e) {
      console.error(e);
      toast.error("Erreur lors de la récupération des commandes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!statusModalOrder) return;

    setUpdating(true);
    try {
      await api.updateOrderStatus(statusModalOrder._id, {
        status: newStatus,
        note: statusNote || `Mise à jour statut vers : ${newStatus}`,
      });
      toast.success("Statut mis à jour avec succès !");
      setStatusModalOrder(null);
      setStatusNote("");
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur de mise à jour.");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">En attente</span>;
      case "confirmed":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">Confirmée</span>;
      case "shipped":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">Expédiée</span>;
      case "delivered":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">Livrée</span>;
      case "cancelled":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">Annulée</span>;
      case "returned":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800">Retournée</span>;
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <>
      <Helmet>
        <title>Gestion des Commandes | Dari Belle Tiaret</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-brand-navy">
              Gestion des Commandes (Paiement à la Livraison)
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Consultez, confirmez par téléphone, suivez les expéditions et générez les factures PDF.
            </p>
          </div>
          <span className="text-xs font-bold text-gray-500 bg-white px-3 py-1.5 rounded-xl border">
            Total : {total} commandes
          </span>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Status buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-xs font-bold">
            {["all", "pending", "confirmed", "shipped", "delivered", "cancelled"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl transition-all capitalize whitespace-nowrap ${
                  statusFilter === st
                    ? "bg-brand-rose text-white shadow"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {st === "all" ? "Toutes" : st === "pending" ? "En attente" : st === "confirmed" ? "Confirmées" : st === "shipped" ? "Expédiées" : st === "delivered" ? "Livrées" : "Annulées"}
              </button>
            ))}
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-72">
            <input
              type="text"
              placeholder="N° commande, client, tel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-brand-rose"
            />
            <button
              type="submit"
              className="bg-brand-navy hover:bg-brand-darkNavy text-white p-2 rounded-xl text-xs"
            >
              <Search size={16} />
            </button>
          </form>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold border-b">
                <tr>
                  <th className="py-3.5 px-4 text-start">N° Commande</th>
                  <th className="py-3.5 px-4 text-start">Date</th>
                  <th className="py-3.5 px-4 text-start">Client</th>
                  <th className="py-3.5 px-4 text-start">Destination</th>
                  <th className="py-3.5 px-4 text-start">Total (DZD)</th>
                  <th className="py-3.5 px-4 text-start">Statut</th>
                  <th className="py-3.5 px-4 text-end">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-400">
                      Chargement des commandes...
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-400">
                      Aucune commande trouvée.
                    </td>
                  </tr>
                ) : (
                  orders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-brand-navy">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3 px-4 text-gray-500">
                        {formatDate(ord.createdAt)}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-brand-navy block">{ord.customer.name}</span>
                        <span className="text-[11px] text-gray-500" dir="ltr">{ord.customer.phone}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-brand-navy block">{ord.customer.wilaya}</span>
                        <span className="text-[11px] text-gray-500">{ord.customer.commune}</span>
                      </td>
                      <td className="py-3 px-4 font-extrabold text-brand-rose">
                        {formatDZD(ord.total)}
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(ord.status)}
                      </td>
                      <td className="py-3 px-4 text-end space-x-1">
                        {/* View Modal */}
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="p-1.5 text-gray-500 hover:text-brand-navy hover:bg-gray-100 rounded-lg"
                          title="Détails"
                        >
                          <Eye size={16} />
                        </button>

                        {/* Change Status */}
                        <button
                          onClick={() => {
                            setStatusModalOrder(ord);
                            setNewStatus(ord.status);
                          }}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Modifier le statut"
                        >
                          <Truck size={16} />
                        </button>

                        {/* Download Invoice PDF */}
                        <a
                          href={api.getInvoicePdfUrl(ord._id)}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-brand-rose hover:bg-brand-rose/10 rounded-lg inline-block"
                          title="Télécharger la Facture PDF"
                        >
                          <Download size={16} />
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* View Order Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Commande #${selectedOrder?.orderNumber}`}
        maxWidth="max-w-2xl"
      >
        {selectedOrder && (
          <div className="space-y-6 text-xs text-gray-700">
            {/* Customer Box */}
            <div className="p-4 bg-brand-cream/60 rounded-xl border border-amber-200/50 space-y-2">
              <h4 className="font-bold text-brand-navy text-sm font-serif">
                Coordonnées du Client :
              </h4>
              <p><strong>Nom :</strong> {selectedOrder.customer.name}</p>
              <p><strong>Téléphone :</strong> <span dir="ltr">{selectedOrder.customer.phone}</span></p>
              <p><strong>Wilaya & Commune :</strong> {selectedOrder.customer.wilaya} — {selectedOrder.customer.commune}</p>
              <p><strong>Adresse de livraison :</strong> {selectedOrder.customer.address}</p>
              {selectedOrder.customer.note && (
                <p><strong>Note :</strong> {selectedOrder.customer.note}</p>
              )}
            </div>

            {/* Items */}
            <div>
              <h4 className="font-bold text-brand-navy text-sm font-serif mb-2">
                Articles commandés :
              </h4>
              <div className="divide-y divide-gray-100 border rounded-xl overflow-hidden">
                {selectedOrder.items.map((it, i) => (
                  <div key={i} className="p-3 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-brand-navy block">{it.name}</span>
                      <span className="text-gray-500">
                        Qté : {it.quantity} × {formatDZD(it.price)}
                      </span>
                    </div>
                    <span className="font-bold text-brand-rose">
                      {formatDZD(it.price * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="space-y-1.5 p-3 bg-gray-50 rounded-xl">
              <div className="flex justify-between">
                <span>Sous-total :</span>
                <span className="font-bold text-brand-navy">{formatDZD(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Frais de port :</span>
                <span className="font-bold text-brand-navy">{formatDZD(selectedOrder.shippingFee)}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-brand-rose font-bold">
                  <span>Remise :</span>
                  <span>-{formatDZD(selectedOrder.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black text-brand-navy pt-2 border-t">
                <span>Total à encaisser :</span>
                <span className="text-brand-rose">{formatDZD(selectedOrder.total)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={api.getInvoicePdfUrl(selectedOrder._id)}
                target="_blank"
                rel="noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-brand-navy hover:bg-brand-darkNavy text-white py-3 rounded-xl font-bold"
              >
                <Download size={16} />
                <span>Télécharger la Facture PDF</span>
              </a>
            </div>
          </div>
        )}
      </Modal>

      {/* Update Status Modal */}
      <Modal
        isOpen={!!statusModalOrder}
        onClose={() => setStatusModalOrder(null)}
        title="Modifier le Statut de la Commande"
        maxWidth="max-w-md"
      >
        {statusModalOrder && (
          <form onSubmit={handleUpdateStatus} className="space-y-4 text-start">
            <div>
              <label className="block text-xs font-bold uppercase text-brand-navy mb-1.5">
                Nouveau Statut
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full border rounded-xl p-2.5 text-sm outline-none focus:border-brand-rose"
              >
                <option value="pending">En attente (Pending)</option>
                <option value="confirmed">Confirmée par téléphone (Confirmed)</option>
                <option value="shipped">Expédiée avec société de livraison (Shipped)</option>
                <option value="delivered">Livrée avec succès (Delivered)</option>
                <option value="cancelled">Annulée (Cancelled - Réintégration stock)</option>
                <option value="returned">Retournée (Returned)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-brand-navy mb-1.5">
                Note de suivi / Commentaire
              </label>
              <textarea
                rows={3}
                placeholder="Ex: Client contacté, confirmation de livraison samedi matin..."
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                className="w-full border rounded-xl p-2.5 text-sm outline-none focus:border-brand-rose"
              />
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full" loading={updating}>
              Mettre à jour le statut
            </Button>
          </form>
        )}
      </Modal>
    </>
  );
};
