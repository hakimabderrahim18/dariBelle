import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../../api/endpoints";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

export const Login = () => {
  const navigate = useNavigate();
  const loginStore = useAuthStore((state) => state.login);

  const [email, setEmail] = useState("admin@daribelle.com");
  const [password, setPassword] = useState("admin123456");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.login({ email, password });
      const { user, accessToken } = res.data.data;
      loginStore(user, accessToken);
      toast.success(`Bienvenue, ${user.name} !`);
      navigate("/admin");
    } catch (err) {
      toast.error(err.response?.data?.message || "Identifiants invalides.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Connexion Administration | Dari Belle Tiaret</title>
      </Helmet>

      <div className="min-h-screen bg-brand-navy flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background decorative arch */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <div className="w-[600px] h-[600px] border-[20px] border-brand-yellow rounded-t-full" />
        </div>

        <div className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-brand-rose rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-brand-rose/30">
              <span className="text-white font-serif font-black text-xl">DB</span>
            </div>
            <h1 className="text-2xl font-serif font-bold text-brand-navy">
              Dari Belle Administration
            </h1>
            <p className="text-xs text-gray-500">
              Accès réservé au personnel du magasin de Tiaret
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Adresse Email"
              type="email"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Mot de passe"
              type="password"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              loading={loading}
            >
              <span>Se connecter</span>
              <ArrowRight size={16} />
            </Button>
          </form>

          {/* Quick Demo Credentials Reminder */}
          <div className="p-4 rounded-xl bg-brand-cream border border-amber-200/60 text-xs text-gray-600 space-y-1">
            <p className="font-bold text-brand-navy">Comptes configurés :</p>
            <p>• Superadmin : <code>admin@daribelle.com</code> (admin123456)</p>
            <p>• Gestionnaire Stock : <code>stock@daribelle.com</code> (stock123456)</p>
          </div>
        </div>
      </div>
    </>
  );
};
