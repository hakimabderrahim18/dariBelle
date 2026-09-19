import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    storeName: { type: String, default: "Dari Belle" },
    slogans: {
      luxury: { type: String, default: "LUXURY LIFESTYLE" },
      ar: { type: String, default: "3AMRI DAREK M3ANA" },
      fr: { type: String, default: "La Beauté a Son Adresse" },
    },
    address: {
      wilaya: { type: String, default: "Tiaret" },
      street: { type: String, default: "Route Lacadémie, à côté du Printemps" },
      country: { type: String, default: "Algérie" },
      mapsUrl: { type: String, default: "https://maps.google.com/?q=Tiaret,Algeria" },
    },
    phones: [{ type: String }],
    emails: [{ type: String }],
    socialMedia: {
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "https://instagram.com/dari_belle" },
      tiktok: { type: String, default: "" },
      whatsapp: { type: String, default: "213659408403" },
    },
    openingHours: {
      fr: { type: String, default: "Samedi - Jeudi : 09h00 - 19h30 | Vendredi : 14h30 - 20h00" },
      ar: { type: String, default: "السبت - الخميس: 09:00 - 19:30 | الجمعة: 14:30 - 20:00" },
    },
    defaultLowStockThreshold: { type: Number, default: 5 },
    freeShippingThreshold: { type: Number, default: 25000 },
  },
  { timestamps: true }
);

export default mongoose.model("Settings", settingsSchema);
