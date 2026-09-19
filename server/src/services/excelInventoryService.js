import ExcelJS from "exceljs";
import { Readable } from "stream";
import csvParser from "csv-parser";

// Complete catalog of exportable attributes with formatting
export const EXPORT_ATTRIBUTES_MAP = {
  sku: { header: "SKU / Référence", width: 18, getValue: (p) => p.sku || "" },
  nameFr: { header: "Nom du Produit (FR)", width: 35, getValue: (p) => p.name?.fr || "" },
  nameAr: { header: "Nom du Produit (AR)", width: 35, getValue: (p) => p.name?.ar || "" },
  category: { header: "Catégorie", width: 24, getValue: (p) => p.category?.name?.fr || "Non catégorisé" },
  brand: { header: "Marque", width: 20, getValue: (p) => p.brand?.name || "Sans marque" },
  purchasePrice: { header: "Prix d'Achat (DZD)", width: 18, getValue: (p) => p.purchasePrice || 0 },
  price: { header: "Prix Vente (DZD)", width: 18, getValue: (p) => p.price || 0 },
  salePrice: { header: "Prix Promo (DZD)", width: 18, getValue: (p) => p.salePrice || "-" },
  stock: { header: "Stock Actuel", width: 14, getValue: (p) => p.stock ?? 0 },
  lowStockThreshold: { header: "Seuil Alerte", width: 14, getValue: (p) => p.lowStockThreshold ?? 5 },
  stockStatus: {
    header: "État du Stock",
    width: 18,
    getValue: (p) => (p.stock <= 0 ? "Rupture" : p.stock <= (p.lowStockThreshold || 5) ? "Stock Faible" : "En Stock"),
  },
  soldCount: { header: "Total Ventes", width: 14, getValue: (p) => p.soldCount || 0 },
  isPublished: { header: "Publié", width: 12, getValue: (p) => (p.isPublished ? "Oui" : "Non") },
  tags: {
    header: "Tags / Badges",
    width: 22,
    getValue: (p) => (Array.isArray(p.tags) && p.tags.length ? p.tags.join(", ") : "-"),
  },
  attributes: {
    header: "Attributs Techniques",
    width: 45,
    getValue: (p) => {
      if (!p.attributes) return "-";
      if (p.attributes instanceof Map) {
        return Array.from(p.attributes.entries()).map(([k, v]) => `${k}: ${v}`).join(" | ");
      }
      if (typeof p.attributes === "object") {
        return Object.entries(p.attributes).map(([k, v]) => `${k}: ${v}`).join(" | ");
      }
      return "-";
    },
  },
  createdAt: {
    header: "Date d'Ajout",
    width: 16,
    getValue: (p) => (p.createdAt ? new Date(p.createdAt).toLocaleDateString("fr-FR") : "-"),
  },
};

export const exportInventoryToExcel = async (products, selectedFieldKeys = null) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Dari Belle Management";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet("Inventaire Dari Belle", {
    views: [{ showGridLines: true }],
  });

  // Determine active columns based on user selection
  const allKeys = Object.keys(EXPORT_ATTRIBUTES_MAP);
  let activeKeys = allKeys;

  if (selectedFieldKeys) {
    let keysArray = selectedFieldKeys;
    if (typeof selectedFieldKeys === "string") {
      keysArray = selectedFieldKeys.split(",").map((s) => s.trim());
    }
    if (Array.isArray(keysArray) && keysArray.length > 0) {
      const filtered = keysArray.filter((k) => allKeys.includes(k));
      if (filtered.length > 0) {
        activeKeys = filtered;
      }
    }
  }

  worksheet.columns = activeKeys.map((key) => ({
    header: EXPORT_ATTRIBUTES_MAP[key].header,
    key,
    width: EXPORT_ATTRIBUTES_MAP[key].width,
  }));

  // Header styling with warm luxury terracotta
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF9E532B" }, // Terracotta
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
  });
  worksheet.getRow(1).height = 30;

  products.forEach((p) => {
    const rowData = {};
    activeKeys.forEach((key) => {
      rowData[key] = EXPORT_ATTRIBUTES_MAP[key].getValue(p);
    });

    const row = worksheet.addRow(rowData);

    // Conditional styling for stockStatus column if included
    if (activeKeys.includes("stockStatus")) {
      const isOutOfStock = p.stock <= 0;
      const isLowStock = p.stock <= (p.lowStockThreshold || 5) && p.stock > 0;
      if (isOutOfStock) {
        row.getCell("stockStatus").fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFFD2D2" },
        };
        row.getCell("stockStatus").font = { color: { argb: "FF900000" }, bold: true };
      } else if (isLowStock) {
        row.getCell("stockStatus").fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFFF3CD" },
        };
        row.getCell("stockStatus").font = { color: { argb: "FF856404" }, bold: true };
      }
    }
  });

  return await workbook.xlsx.writeBuffer();
};

export const parseInventoryCsv = (buffer) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const stream = Readable.from(buffer.toString("utf8"));

    stream
      .pipe(csvParser())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
};
