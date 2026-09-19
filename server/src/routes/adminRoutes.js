import express from "express";
import { authenticate, authorize } from "../middlewares/auth.js";
import { upload } from "../middlewares/upload.js";
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import {
  createBrand,
  updateBrand,
  deleteBrand,
} from "../controllers/brandController.js";
import {
  getAllSlides,
  createSlide,
  updateSlide,
  deleteSlide,
  reorderSlides,
} from "../controllers/heroSlideController.js";
import {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from "../controllers/couponController.js";
import { updateShippingZone } from "../controllers/shippingZoneController.js";
import {
  getOrders,
  getOrderById,
  updateOrderStatus,
  getOrderInvoicePdf,
} from "../controllers/orderController.js";
import {
  getInventory,
  addStockMovement,
  getStockMovements,
  exportInventoryExcel,
  importInventoryCsv,
} from "../controllers/inventoryController.js";
import { getDashboardStats } from "../controllers/statsController.js";
import { updateSettings } from "../controllers/settingsController.js";

const router = express.Router();

// Protect all admin routes
router.use(authenticate);
router.use(authorize("superadmin", "stock_manager"));

// Stats
router.get("/stats", getDashboardStats);

// Products
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

// Categories
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

// Brands
router.post("/brands", createBrand);
router.put("/brands/:id", updateBrand);
router.delete("/brands/:id", deleteBrand);

// Hero Slides
router.get("/hero-slides", getAllSlides);
router.post("/hero-slides", createSlide);
router.patch("/hero-slides/reorder", reorderSlides);
router.put("/hero-slides/:id", updateSlide);
router.delete("/hero-slides/:id", deleteSlide);

// Coupons
router.get("/coupons", getCoupons);
router.post("/coupons", createCoupon);
router.put("/coupons/:id", updateCoupon);
router.delete("/coupons/:id", deleteCoupon);

// Shipping Zones
router.put("/shipping-zones/:id", updateShippingZone);

// Orders
router.get("/orders", getOrders);
router.get("/orders/:id", getOrderById);
router.patch("/orders/:id/status", updateOrderStatus);
router.get("/orders/:id/invoice", getOrderInvoicePdf);

// Inventory & Movements
router.get("/inventory", getInventory);
router.post("/inventory/movements", addStockMovement);
router.get("/inventory/movements", getStockMovements);
router.get("/inventory/export", exportInventoryExcel);
router.post("/inventory/import", upload.single("file"), importInventoryCsv);

// Settings
router.patch("/settings", updateSettings);

export default router;
