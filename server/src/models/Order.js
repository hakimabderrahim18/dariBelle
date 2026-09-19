import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  image: { type: String, default: "" },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  variantSku: { type: String, default: null },
});

const statusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["pending", "confirmed", "shipped", "delivered", "cancelled", "returned"],
    required: true,
  },
  note: { type: String, default: "" },
  date: { type: Date, default: Date.now },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    items: [orderItemSchema],
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      wilaya: { type: String, required: true },
      commune: { type: String, required: true },
      address: { type: String, required: true },
      note: { type: String, default: "" },
    },
    shippingFee: { type: Number, required: true, default: 0 },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled", "returned"],
      default: "pending",
    },
    coupon: { type: String, default: null },
    paymentMethod: { type: String, default: "COD" },
    statusHistory: [statusHistorySchema],
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
