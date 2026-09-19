import Product from "../models/Product.js";
import StockMovement from "../models/StockMovement.js";

export const recordStockMovement = async ({
  productId,
  variantSku = null,
  type,
  quantity,
  reason,
  reference = "",
  performedBy = null,
}) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Produit non trouvé pour l'ajustement de stock.");
  }

  let stockBefore = 0;
  let stockAfter = 0;

  if (variantSku && product.variants?.length > 0) {
    const variantIndex = product.variants.findIndex((v) => v.sku === variantSku);
    if (variantIndex === -1) {
      throw new Error(`Variante avec SKU ${variantSku} introuvable.`);
    }
    stockBefore = product.variants[variantIndex].stock;
    if (type === "in" || type === "return") {
      stockAfter = stockBefore + quantity;
    } else if (type === "out") {
      stockAfter = Math.max(0, stockBefore - quantity);
    } else if (type === "adjustment") {
      stockAfter = Math.max(0, quantity);
    }
    product.variants[variantIndex].stock = stockAfter;
    // Update total product stock as sum of variants
    product.stock = product.variants.reduce((acc, v) => acc + v.stock, 0);
  } else {
    stockBefore = product.stock;
    if (type === "in" || type === "return") {
      stockAfter = stockBefore + quantity;
    } else if (type === "out") {
      stockAfter = Math.max(0, stockBefore - quantity);
    } else if (type === "adjustment") {
      stockAfter = Math.max(0, quantity);
    }
    product.stock = stockAfter;
  }

  await product.save();

  const movement = await StockMovement.create({
    product: productId,
    variantSku,
    type,
    quantity: type === "adjustment" ? Math.abs(stockAfter - stockBefore) : quantity,
    reason,
    reference,
    stockBefore,
    stockAfter,
    performedBy,
  });

  return { product, movement };
};
