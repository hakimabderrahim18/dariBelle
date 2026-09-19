import express from "express";
import { getProducts, getProductBySlug } from "../controllers/productController.js";
import { getCategories } from "../controllers/categoryController.js";
import { getBrands } from "../controllers/brandController.js";
import { getActiveSlides } from "../controllers/heroSlideController.js";
import { getShippingZones } from "../controllers/shippingZoneController.js";
import { createOrder, trackOrder } from "../controllers/orderController.js";
import { validateCoupon } from "../controllers/couponController.js";
import { getSettings } from "../controllers/settingsController.js";

const router = express.Router();

router.get("/products", getProducts);
router.get("/products/:slug", getProductBySlug);
router.get("/categories", getCategories);
router.get("/brands", getBrands);
router.get("/hero-slides", getActiveSlides);
router.get("/shipping-zones", getShippingZones);
router.post("/orders", createOrder);
router.get("/orders/track/:orderNumber", trackOrder);
router.post("/coupons/validate", validateCoupon);
router.get("/settings", getSettings);

export default router;
