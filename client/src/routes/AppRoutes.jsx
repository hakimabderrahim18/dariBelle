import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { PublicLayout } from "./PublicLayout";
import { ProtectedRoute } from "./ProtectedRoute";

// Public pages
import { Home } from "../pages/public/Home";
import { Catalog } from "../pages/public/Catalog";
import { ProductDetail } from "../pages/public/ProductDetail";
import { Cart } from "../pages/public/Cart";
import { Checkout } from "../pages/public/Checkout";
import { OrderSuccess } from "../pages/public/OrderSuccess";
import { OrderTracking } from "../pages/public/OrderTracking";
import { About } from "../pages/public/About";
import { Contact } from "../pages/public/Contact";

// Admin pages
import { Login } from "../pages/admin/Login";
import { AdminLayout } from "../components/admin/AdminLayout";
import { Dashboard } from "../pages/admin/Dashboard";
import { OrdersManager } from "../pages/admin/OrdersManager";
import { ProductsManager } from "../pages/admin/ProductsManager";
import { InventoryManager } from "../pages/admin/InventoryManager";
import { CategoriesManager } from "../pages/admin/CategoriesManager";
import { HeroSlidesManager } from "../pages/admin/HeroSlidesManager";
import { CouponsManager } from "../pages/admin/CouponsManager";
import { ShippingManager } from "../pages/admin/ShippingManager";
import { SettingsManager } from "../pages/admin/SettingsManager";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Storefront */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success/:orderNumber" element={<OrderSuccess />} />
        <Route path="/track-order" element={<OrderTracking />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Admin Auth */}
      <Route path="/admin/login" element={<Login />} />

      {/* Protected Admin Backoffice */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/orders" element={<OrdersManager />} />
          <Route path="/admin/products" element={<ProductsManager />} />
          <Route path="/admin/inventory" element={<InventoryManager />} />
          <Route path="/admin/categories" element={<CategoriesManager />} />
          <Route path="/admin/hero-slides" element={<HeroSlidesManager />} />
          <Route path="/admin/coupons" element={<CouponsManager />} />
          <Route path="/admin/shipping" element={<ShippingManager />} />
          <Route path="/admin/settings" element={<SettingsManager />} />
        </Route>
      </Route>

      {/* Catch-all redirect to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
