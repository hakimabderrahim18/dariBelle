import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      fr: { type: String, required: true, trim: true },
      ar: { type: String, required: true, trim: true },
    },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    image: { type: String, default: "" },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
