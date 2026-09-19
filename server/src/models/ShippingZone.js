import mongoose from "mongoose";

const shippingZoneSchema = new mongoose.Schema(
  {
    wilayaCode: { type: Number, required: true, unique: true },
    wilaya: {
      fr: { type: String, required: true },
      ar: { type: String, required: true },
    },
    fee: { type: Number, required: true, min: 0 },
    deskFee: { type: Number, default: 0 },
    deliveryDays: { type: String, default: "2-3 jours" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("ShippingZone", shippingZoneSchema);
