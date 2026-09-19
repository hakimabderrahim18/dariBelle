import mongoose from "mongoose";

const heroSlideSchema = new mongoose.Schema(
  {
    image: {
      desktop: { type: String, required: true },
      mobile: { type: String, default: "" },
    },
    title: {
      fr: { type: String, required: true },
      ar: { type: String, required: true },
    },
    subtitle: {
      fr: { type: String, default: "" },
      ar: { type: String, default: "" },
    },
    badge: { type: String, default: "" },
    ctaLabel: {
      fr: { type: String, default: "Découvrir la collection" },
      ar: { type: String, default: "اكتشف التشكيلة" },
    },
    ctaLink: { type: String, default: "/catalog" },
    order: { type: Number, default: 0 },
    startsAt: { type: Date, default: null },
    endsAt: { type: Date, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("HeroSlide", heroSlideSchema);
