import Product from "../models/Product.js";
import StockMovement from "../models/StockMovement.js";
import { recordStockMovement } from "../services/stockService.js";
import { exportInventoryToExcel, parseInventoryCsv } from "../services/excelInventoryService.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

export const getInventory = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { "name.fr": { $regex: search, $options: "i" } },
        { "name.ar": { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
      ];
    }

    const products = await Product.find(query)
      .populate("category", "name slug")
      .populate("brand", "name")
      .sort({ stock: 1 });

    let filtered = products;
    if (status === "out") {
      filtered = products.filter((p) => p.stock <= 0);
    } else if (status === "low") {
      filtered = products.filter((p) => p.stock > 0 && p.stock <= (p.lowStockThreshold || 5));
    } else if (status === "in_stock") {
      filtered = products.filter((p) => p.stock > (p.lowStockThreshold || 5));
    }

    const totalStockUnits = products.reduce((acc, p) => acc + p.stock, 0);
    const totalPurchaseValue = products.reduce((acc, p) => acc + (p.purchasePrice || 0) * p.stock, 0);
    const totalRetailValue = products.reduce((acc, p) => acc + p.price * p.stock, 0);
    const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= (p.lowStockThreshold || 5)).length;
    const outOfStockCount = products.filter((p) => p.stock <= 0).length;

    return sendSuccess(res, 200, "Inventaire récupéré.", {
      products: filtered,
      summary: {
        totalProducts: products.length,
        totalStockUnits,
        totalPurchaseValue,
        totalRetailValue,
        lowStockCount,
        outOfStockCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const addStockMovement = async (req, res, next) => {
  try {
    const { productId, variantSku, type, quantity, reason, reference } = req.body;

    if (!productId || !type || quantity === undefined || !reason) {
      return sendError(res, 400, "Veuillez fournir le produit, le type, la quantité et le motif.");
    }

    const result = await recordStockMovement({
      productId,
      variantSku,
      type,
      quantity: Number(quantity),
      reason,
      reference,
      performedBy: req.user?._id,
    });

    return sendSuccess(res, 201, "Mouvement de stock enregistré avec succès.", result);
  } catch (error) {
    next(error);
  }
};

export const getStockMovements = async (req, res, next) => {
  try {
    const { productId, type, page = 1, limit = 25 } = req.query;
    const query = {};

    if (productId) query.product = productId;
    if (type) query.type = type;

    const pageNumber = Math.max(1, parseInt(page));
    const pageSize = Math.max(1, parseInt(limit));
    const skip = (pageNumber - 1) * pageSize;

    const [movements, total] = await Promise.all([
      StockMovement.find(query)
        .populate("product", "name sku images")
        .populate("performedBy", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize),
      StockMovement.countDocuments(query),
    ]);

    return sendSuccess(res, 200, "Historique des mouvements récupéré.", movements, {
      total,
      page: pageNumber,
      pages: Math.ceil(total / pageSize),
      limit: pageSize,
    });
  } catch (error) {
    next(error);
  }
};

export const exportInventoryExcel = async (req, res, next) => {
  try {
    const products = await Product.find()
      .populate("category", "name")
      .populate("brand", "name")
      .sort({ sku: 1 });

    const buffer = await exportInventoryToExcel(products);

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=inventaire-dari-belle-${new Date().toISOString().slice(0, 10)}.xlsx`
    );

    return res.end(buffer);
  } catch (error) {
    next(error);
  }
};

export const importInventoryCsv = async (req, res, next) => {
  try {
    if (!req.file) {
      return sendError(res, 400, "Veuillez joindre un fichier CSV.");
    }

    const records = await parseInventoryCsv(req.file.buffer);
    const updated = [];
    const errors = [];

    for (const row of records) {
      const sku = row.sku || row.SKU;
      const quantity = parseInt(row.stock || row.Stock || row.quantity || row.Quantite);

      if (!sku || isNaN(quantity)) {
        errors.push(`Ligne ignorée : données invalides (${JSON.stringify(row)})`);
        continue;
      }

      const product = await Product.findOne({ sku: sku.trim().toUpperCase() });
      if (!product) {
        errors.push(`SKU introuvable : ${sku}`);
        continue;
      }

      await recordStockMovement({
        productId: product._id,
        type: "adjustment",
        quantity,
        reason: "Mise à jour par import CSV inventaire",
        reference: req.file.originalname,
        performedBy: req.user?._id,
      });

      updated.push(sku);
    }

    return sendSuccess(res, 200, "Importation terminée.", {
      updatedCount: updated.length,
      errorsCount: errors.length,
      errors,
    });
  } catch (error) {
    next(error);
  }
};
