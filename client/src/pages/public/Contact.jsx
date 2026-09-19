import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

export const Contact = () => {
  const { t, i18n } = useTranslation();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Merci ! Votre message a été transmis à l'équipe Dari Belle Tiaret.");
    setName("");
    setPhone("");
    setMessage("");
  };

  return (
    <>
      <Helmet>
        <title>Contact & Accès | Dari Belle Tiaret</title>
      </Helmet>

      <div className="bg-brand-cream/50 py-10 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
          <span className="text-xs uppercase tracking-luxury font-black text-brand-rose">
            DARI BELLE TIARET
          </span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy">
            {t("nav.contact")}
          </h1>
          <p className="text-xs md:text-sm text-gray-500">
            Notre équipe vous accueille avec plaisir en magasin ou vous répond 7j/7 par téléphone et WhatsApp.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Coordinates & Opening hours */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-md space-y-6">
              <h2 className="font-serif font-bold text-xl text-brand-navy">
                Coordonnées du Magasin
              </h2>

              <ul className="space-y-4 text-sm text-gray-700">
                <li className="flex items-start gap-3">
                  <div className="p-2 bg-brand-rose/10 text-brand-rose rounded-xl shrink-0 mt-0.5">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <strong className="block text-brand-navy">Adresse physique :</strong>
                    <span>Route Lacadémie, à côté du Printemps, Tiaret – Algérie</span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="p-2 bg-brand-yellow/20 text-amber-700 rounded-xl shrink-0 mt-0.5">
                    <Phone size={20} />
                  </div>
                  <div>
                    <strong className="block text-brand-navy">Téléphones :</strong>
                    <div className="flex flex-col gap-1 text-sm font-bold" dir="ltr">
                      <a href="tel:0659408403" className="hover:text-brand-rose">
                        06 59 40 84 03
                      </a>
                      <a href="tel:0551007098" className="hover:text-brand-rose">
                        05 51 00 70 98
                      </a>
                    </div>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="p-2 bg-brand-teal/10 text-brand-teal rounded-xl shrink-0 mt-0.5">
                    <Clock size={20} />
                  </div>
                  <div>
                    <strong className="block text-brand-navy">Horaires d'ouverture :</strong>
                    <p className="text-xs text-gray-500">
                      Samedi - Jeudi : 09h00 - 19h30<br />
                      Vendredi : 14h30 - 20h00
                    </p>
                  </div>
                </li>
              </ul>

              {/* WhatsApp direct button */}
              <a
                href="https://wa.me/213659408403"
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-2xl text-sm shadow-md transition-all"
              >
                <MessageCircle size={18} />
                <span>Contacter directement sur WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Contact form */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-md">
            <h2 className="font-serif font-bold text-xl text-brand-navy mb-4">
              Envoyez-nous un message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Votre nom"
                placeholder="Ex: Mohamed Cherif"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                label="Votre téléphone"
                placeholder="06 59 40 84 03"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                dir="ltr"
              />

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-navy mb-1.5">
                  Message ou question
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Renseignements sur un produit, disponibilité en magasin..."
                  className="w-full rounded-xl border border-gray-200 p-3.5 text-sm text-brand-navy focus:border-brand-rose focus:ring-1 focus:ring-brand-rose outline-none"
                  required
                />
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full">
                <Send size={16} />
                <span>Envoyer le message</span>
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
