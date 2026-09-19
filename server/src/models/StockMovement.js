import mongoose from "mongoose";

const stockMovementSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    variantSku: { type: String, default: null },
    type: {
      type: String,
      enum: ["in", "out", "adjustment", "return"],
      required: true,
    },
    quantity: { type: Number, required: true },
    reason: { type: String, required: true },
    reference: { type: String, default: "" },
    stockBefore: { type: Number, required: true },
    stockAfter: { type: Number, required: true },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

export default mongoose.model("StockMovement", stockMovementSchema);
