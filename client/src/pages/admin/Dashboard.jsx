import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  DollarSign,
  ShoppingBag,
  Clock,
  AlertTriangle,
  TrendingUp,
  Package,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { api } from "../../api/endpoints";
import { formatDZD } from "../../utils/formatters";

export const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.getStats();
        if (res.data.data) {
          setStats(res.data.data);
        }
      } catch (e) {
        console.error("Error fetching admin stats:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-28 bg-white rounded-2xl border" />
          ))}
        </div>
        <div className="h-80 bg-white rounded-2xl border" />
      </div>
    );
  }

  const kpis = stats?.kpis || {};
  const salesSeries = stats?.salesSeries || [];
  const statusDist = stats?.statusDistribution || [];
  const topProducts = stats?.topProducts || [];

  const COLORS = ["#F2A81D", "#3FB8A8", "#28A745", "#D42A52"];

  return (
    <>
      <Helmet>
        <title>Tableau de bord | Dari Belle Tiaret</title>
      </Helmet>

      <div className="space-y-8">
        {/* Welcome greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-brand-navy">
              Tableau de Bord & Performance
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Vue synthétique des ventes, commandes et stocks du magasin Dari Belle Tiaret.
            </p>
          </div>
        </div>

        {/* Top 4 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Revenue */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Chiffre d'Affaires Total
              </span>
              <div className="p-2 rounded-xl bg-brand-rose/10 text-brand-rose">
                <DollarSign size={20} />
              </div>
            </div>
            <div className="text-2xl font-black text-brand-navy">
              {formatDZD(kpis.totalRevenue || 0)}
            </div>
            <p className="text-[11px] text-gray-500">
              Ce mois : <strong>{formatDZD(kpis.monthRevenue || 0)}</strong>
            </p>
          </div>

          {/* Orders */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Commandes Totales
              </span>
              <div className="p-2 rounded-xl bg-brand-navy/10 text-brand-navy">
                <ShoppingBag size={20} />
              </div>
            </div>
            <div className="text-2xl font-black text-brand-navy">
              {kpis.totalOrders || 0}
            </div>
            <p className="text-[11px] text-gray-500">
              Panier moyen : <strong>{formatDZD(kpis.averageOrderValue || 0)}</strong>
            </p>
          </div>

          {/* Pending Orders */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Commandes en Attente
              </span>
              <div className="p-2 rounded-xl bg-brand-yellow/20 text-amber-800">
                <Clock size={20} />
              </div>
            </div>
            <div className="text-2xl font-black text-amber-700">
              {kpis.pendingOrders || 0}
            </div>
            <p className="text-[11px] text-gray-500">
              Nécessitent un appel de confirmation
            </p>
          </div>

          {/* Stock Alerts */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Alertes Stock
              </span>
              <div className="p-2 rounded-xl bg-red-100 text-red-600">
                <AlertTriangle size={20} />
              </div>
            </div>
            <div className="text-2xl font-black text-red-600">
              {(kpis.lowStockProducts || 0) + (kpis.outOfStockProducts || 0)}
            </div>
            <p className="text-[11px] text-gray-500">
              {kpis.outOfStockProducts || 0} en rupture, {kpis.lowStockProducts || 0} stock faible
            </p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Evolution 30 Days */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-serif font-bold text-base text-brand-navy">
                  Évolution des Ventes (30 Derniers Jours)
                </h3>
                <p className="text-xs text-gray-400">Montant total des commandes validées en DZD</p>
              </div>
              <TrendingUp size={20} className="text-brand-teal" />
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesSeries}>
                  <defs>
                    <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D42A52" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#D42A52" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(value) => [`${value.toLocaleString("fr-DZ")} DZD`, "Ventes"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#D42A52"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#salesGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Orders by Status Pie */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="border-b pb-3">
              <h3 className="font-serif font-bold text-base text-brand-navy">
                Commandes par Statut
              </h3>
              <p className="text-xs text-gray-400">Répartition du traitement</p>
            </div>

            <div className="h-72 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDist}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {statusDist.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top Selling Products List */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-serif font-bold text-base text-brand-navy">
              Articles les Plus Populaires & Vendus
            </h3>
            <span className="text-xs font-bold text-brand-rose">Top 5</span>
          </div>

          <div className="divide-y divide-gray-100">
            {topProducts.map((p) => (
              <div key={p._id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={p.images?.[0] || "https://images.unsplash.com/photo-1615865417491-9941019fbc00?w=100"}
                    alt={p.name?.fr}
                    className="w-12 h-12 rounded-xl object-cover border"
                  />
                  <div>
                    <h4 className="font-bold text-brand-navy text-sm">{p.name?.fr}</h4>
                    <p className="text-gray-500">Stock restant : {p.stock} unités</p>
                  </div>
                </div>

                <div className="text-end">
                  <span className="font-bold text-brand-navy block text-sm">
                    {p.soldCount || 0} vendus
                  </span>
                  <span className="text-brand-rose font-bold">{formatDZD(p.price)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
