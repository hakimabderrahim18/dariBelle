import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true },
  stock: { type: Number, default: 0, min: 0 },
  price: { type: Number, required: true },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      fr: { type: String, required: true, trim: true },
      ar: { type: String, required: true, trim: true },
    },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: {
      fr: { type: String, default: "" },
      ar: { type: String, default: "" },
    },
    images: [{ type: String, required: true }],
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand", default: null },
    sku: { type: String, required: true, unique: true, uppercase: true, trim: true },
    purchasePrice: { type: Number, default: 0 },
    price: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, default: null },
    saleEndsAt: { type: Date, default: null },
    variants: [variantSchema],
    stock: { type: Number, required: true, default: 0, min: 0 },
    lowStockThreshold: { type: Number, default: 5 },
    tags: [{ type: String, enum: ["new", "promo", "bestseller"] }],
    isPublished: { type: Boolean, default: true },
    soldCount: { type: Number, default: 0 },
    attributes: { type: Map, of: String, default: {} },
  },
  { timestamps: true }
);

productSchema.index({ "name.fr": "text", "name.ar": "text", sku: "text" });

export default mongoose.model("Product", productSchema);
