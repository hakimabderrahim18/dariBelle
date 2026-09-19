import React, { useState } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Sliders,
  Tag,
  Truck,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Boxes,
  ShieldCheck,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";

export const AdminLayout = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const navItems = [
    { label: "Tableau de bord", path: "/admin", icon: LayoutDashboard },
    { label: "Commandes (COD)", path: "/admin/orders", icon: ShoppingBag },
    { label: "Produits & Articles", path: "/admin/products", icon: Package },
    { label: "Stock & Inventaire", path: "/admin/inventory", icon: Boxes },
    { label: "Catégories", path: "/admin/categories", icon: Layers },
    { label: "Bannières & Sliders", path: "/admin/hero-slides", icon: Sliders },
    { label: "Codes Promo", path: "/admin/coupons", icon: Tag },
    { label: "Frais 58 Wilayas", path: "/admin/shipping", icon: Truck },
    { label: "Paramètres Boutique", path: "/admin/settings", icon: Settings },
  ];

  const isActive = (path) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-brand-navy text-white shrink-0 border-r border-white/10">
        {/* Logo */}
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-rose flex items-center justify-center font-serif font-black text-white shadow">
            DB
          </div>
          <div>
            <h2 className="font-serif font-bold text-lg text-white">Dari Belle</h2>
            <span className="text-[10px] tracking-luxury uppercase text-brand-yellow font-bold block">
              GESTION TIARET
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  active
                    ? "bg-brand-rose text-white shadow-md shadow-brand-rose/20"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom User info & Public link */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-300">
            <div>
              <span className="font-bold text-white block">{user?.name || "Admin"}</span>
              <span className="text-[10px] text-brand-yellow font-mono capitalize">
                {user?.role === "superadmin" ? "Directeur Général" : "Gestionnaire Stock"}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors"
              title="Déconnexion"
            >
              <LogOut size={16} />
            </button>
          </div>

          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold transition-colors"
          >
            <ExternalLink size={14} />
            <span>Voir la boutique</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 py-3.5 px-6 flex items-center justify-between shadow-sm sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 text-brand-navy rounded-lg hover:bg-gray-100"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className="hidden sm:block">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                Espace d'Administration & Gestion de Stock
              </span>
              <h1 className="text-base font-bold text-brand-navy font-serif">
                Dari Belle — Tiaret, Algérie
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
              <ShieldCheck size={14} />
              <span>Connecté : {user?.email}</span>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-gray-100 transition-colors"
              title="Déconnexion"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Mobile Sidebar overlay */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm"
              onClick={() => setIsSidebarOpen(false)}
            />
            <div className="relative w-64 bg-brand-navy text-white h-full p-4 flex flex-col shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-brand-rose flex items-center justify-center font-bold">
                    DB
                  </div>
                  <span className="font-serif font-bold">Dari Belle</span>
                </div>
                <button onClick={() => setIsSidebarOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                        active ? "bg-brand-rose text-white" : "text-gray-300 hover:bg-white/10"
                      }`}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <button
                onClick={handleLogout}
                className="mt-4 flex items-center justify-center gap-2 w-full py-2 bg-red-600/80 text-white rounded-xl text-xs font-bold"
              >
                <LogOut size={16} />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        )}

        {/* Page Content Outlet */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
