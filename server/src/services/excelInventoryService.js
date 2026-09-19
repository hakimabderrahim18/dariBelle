import ExcelJS from "exceljs";
import { Readable } from "stream";
import csvParser from "csv-parser";

export const exportInventoryToExcel = async (products) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Dari Belle Management";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet("Inventaire Dari Belle", {
    views: [{ showGridLines: true }],
  });

  worksheet.columns = [
    { header: "SKU", key: "sku", width: 16 },
    { header: "Nom du Produit (FR)", key: "nameFr", width: 35 },
    { header: "Nom du Produit (AR)", key: "nameAr", width: 35 },
    { header: "Catégorie", key: "category", width: 22 },
    { header: "Marque", key: "brand", width: 18 },
    { header: "Prix d'Achat (DZD)", key: "purchasePrice", width: 18 },
    { header: "Prix Vente (DZD)", key: "price", width: 18 },
    { header: "Prix Promo (DZD)", key: "salePrice", width: 18 },
    { header: "Stock Actuel", key: "stock", width: 14 },
    { header: "Seuil Alerte", key: "lowStockThreshold", width: 14 },
    { header: "État Stock", key: "stockStatus", width: 16 },
    { header: "Total Vendu", key: "soldCount", width: 14 },
    { header: "Publié", key: "isPublished", width: 12 },
  ];

  // Header styling
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1B1F4A" }, // Navy
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
  });
  worksheet.getRow(1).height = 28;

  products.forEach((p) => {
    const isOutOfStock = p.stock <= 0;
    const isLowStock = p.stock <= p.lowStockThreshold && p.stock > 0;
    const stockStatus = isOutOfStock ? "Rupture" : isLowStock ? "Stock Faible" : "En Stock";

    const row = worksheet.addRow({
      sku: p.sku,
      nameFr: p.name?.fr || "",
      nameAr: p.name?.ar || "",
      category: p.category?.name?.fr || "Non catégorisé",
      brand: p.brand?.name || "Sans marque",
      purchasePrice: p.purchasePrice || 0,
      price: p.price,
      salePrice: p.salePrice || "-",
      stock: p.stock,
      lowStockThreshold: p.lowStockThreshold,
      stockStatus,
      soldCount: p.soldCount || 0,
      isPublished: p.isPublished ? "Oui" : "Non",
    });

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
