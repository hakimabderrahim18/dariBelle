import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    logo: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Brand", brandSchema);
