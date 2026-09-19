import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Save, Store, Phone, MapPin, Clock, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../../api/endpoints";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

export const SettingsManager = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [storeName, setStoreName] = useState("Dari Belle");
  const [sloganLuxury, setSloganLuxury] = useState("LUXURY LIFESTYLE");
  const [sloganAr, setSloganAr] = useState("3AMRI DAREK M3ANA");
  const [sloganFr, setSloganFr] = useState("La Beauté a Son Adresse");
  const [street, setStreet] = useState("Route Lacadémie, à côté du Printemps");
  const [wilaya, setWilaya] = useState("Tiaret");
  const [phone1, setPhone1] = useState("06 59 40 84 03");
  const [phone2, setPhone2] = useState("05 51 00 70 98");
  const [hoursFr, setHoursFr] = useState("Samedi - Jeudi : 09h00 - 19h30 | Vendredi : 14h30 - 20h00");
  const [hoursAr, setHoursAr] = useState("السبت إلى الخميس: 09:00 - 19:30 | الجمعة: 14:30 - 20:00");
  const [freeShippingThreshold, setFreeShippingThreshold] = useState("35000");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.getSettings();
        if (res.data.data) {
          const s = res.data.data;
          setStoreName(s.storeName || "Dari Belle");
          setSloganLuxury(s.slogans?.luxury || "LUXURY LIFESTYLE");
          setSloganAr(s.slogans?.ar || "3AMRI DAREK M3ANA");
          setSloganFr(s.slogans?.fr || "La Beauté a Son Adresse");
          setStreet(s.address?.street || "Route Lacadémie, à côté du Printemps");
          setWilaya(s.address?.wilaya || "Tiaret");
          setPhone1(s.phones?.[0] || "06 59 40 84 03");
          setPhone2(s.phones?.[1] || "05 51 00 70 98");
          setHoursFr(s.openingHours?.fr || "");
          setHoursAr(s.openingHours?.ar || "");
          setFreeShippingThreshold(s.freeShippingThreshold?.toString() || "35000");
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateSettings({
        storeName,
        slogans: { luxury: sloganLuxury, ar: sloganAr, fr: sloganFr },
        address: { street, wilaya, country: "Algérie" },
        phones: [phone1, phone2],
        openingHours: { fr: hoursFr, ar: hoursAr },
        freeShippingThreshold: Number(freeShippingThreshold) || 35000,
      });
      toast.success("Paramètres enregistrés avec succès !");
    } catch (err) {
      toast.error("Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Paramètres du Magasin | Dari Belle Tiaret</title>
      </Helmet>

      <div className="max-w-4xl mx-auto space-y-6 text-start">
        <div>
          <h1 className="text-2xl font-serif font-bold text-brand-navy">
            Paramètres & Identité du Magasin
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Mettez à jour les coordonnées officielles à Tiaret, téléphones et seuils de livraison gratuite.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-base text-brand-navy border-b pb-2 flex items-center gap-2">
              <Store size={18} className="text-brand-rose" />
              <span>Identité & Slogans</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nom de l'enseigne"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
              />
              <Input
                label="Baseline Luxe (Majuscules)"
                value={sloganLuxury}
                onChange={(e) => setSloganLuxury(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Slogan Arabe"
                value={sloganAr}
                onChange={(e) => setSloganAr(e.target.value)}
                dir="rtl"
              />
              <Input
                label="Slogan Français"
                value={sloganFr}
                onChange={(e) => setSloganFr(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-serif font-bold text-base text-brand-navy border-b pb-2 flex items-center gap-2">
              <Phone size={18} className="text-brand-yellow" />
              <span>Téléphones & Contact Tiaret</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Numéro Principal (Appels & WhatsApp)"
                value={phone1}
                onChange={(e) => setPhone1(e.target.value)}
                dir="ltr"
              />
              <Input
                label="Numéro Secondaire"
                value={phone2}
                onChange={(e) => setPhone2(e.target.value)}
                dir="ltr"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Adresse physique (Rue & Repère)"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />
              <Input
                label="Ville / Wilaya"
                value={wilaya}
                onChange={(e) => setWilaya(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-serif font-bold text-base text-brand-navy border-b pb-2 flex items-center gap-2">
              <Clock size={18} className="text-brand-teal" />
              <span>Horaires & Livraison</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Horaires (Français)"
                value={hoursFr}
                onChange={(e) => setHoursFr(e.target.value)}
              />
              <Input
                label="Horaires (Arabe)"
                value={hoursAr}
                onChange={(e) => setHoursAr(e.target.value)}
                dir="rtl"
              />
            </div>

            <Input
              label="Seuil pour Livraison Gratuite (DZD)"
              type="number"
              value={freeShippingThreshold}
              onChange={(e) => setFreeShippingThreshold(e.target.value)}
              helperText="Les commandes dépassant ce montant bénéficieront de la livraison gratuite."
            />
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full" loading={saving}>
            <Save size={16} />
            <span>Enregistrer les paramètres du magasin</span>
          </Button>
        </form>
      </div>
    </>
  );
};
