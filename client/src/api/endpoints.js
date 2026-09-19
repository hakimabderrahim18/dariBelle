import axiosInstance from "./axiosInstance";

export const api = {
  // Public
  getProducts: (params) => axiosInstance.get("/products", { params }),
  getProductBySlug: (slug) => axiosInstance.get(`/products/${slug}`),
  getCategories: () => axiosInstance.get("/categories"),
  getBrands: () => axiosInstance.get("/brands"),
  getHeroSlides: () => axiosInstance.get("/hero-slides"),
  getShippingZones: () => axiosInstance.get("/shipping-zones"),
  createOrder: (orderData) => axiosInstance.post("/orders", orderData),
  trackOrder: (orderNumber, phone) =>
    axiosInstance.get(`/orders/track/${orderNumber}`, { params: { phone } }),
  validateCoupon: (code, orderAmount) =>
    axiosInstance.post("/coupons/validate", { code, orderAmount }),
  getSettings: () => axiosInstance.get("/settings"),

  // Auth
  login: (credentials) => axiosInstance.post("/auth/login", credentials),
  logout: () => axiosInstance.post("/auth/logout"),
  getMe: () => axiosInstance.get("/auth/me"),

  // Admin
  getStats: () => axiosInstance.get("/admin/stats"),
  getAdminOrders: (params) => axiosInstance.get("/admin/orders", { params }),
  getOrderById: (id) => axiosInstance.get(`/admin/orders/${id}`),
  updateOrderStatus: (id, data) => axiosInstance.patch(`/admin/orders/${id}/status`, data),
  getInvoicePdfUrl: (id) => `${axiosInstance.defaults.baseURL}/admin/orders/${id}/invoice`,

  getAdminProducts: (params) => axiosInstance.get("/products", { params }),
  createProduct: (data) => axiosInstance.post("/admin/products", data),
  updateProduct: (id, data) => axiosInstance.put(`/admin/products/${id}`, data),
  deleteProduct: (id) => axiosInstance.delete(`/admin/products/${id}`),

  createCategory: (data) => axiosInstance.post("/admin/categories", data),
  updateCategory: (id, data) => axiosInstance.put(`/admin/categories/${id}`, data),
  deleteCategory: (id) => axiosInstance.delete(`/admin/categories/${id}`),

  getInventory: (params) => axiosInstance.get("/admin/inventory", { params }),
  addStockMovement: (data) => axiosInstance.post("/admin/inventory/movements", data),
  getStockMovements: (params) => axiosInstance.get("/admin/inventory/movements", { params }),
  exportInventoryUrl: `${axiosInstance.defaults.baseURL}/admin/inventory/export`,
  exportInventoryBlob: (params) =>
    axiosInstance.get("/admin/inventory/export", {
      params,
      responseType: "blob",
    }),
  importInventoryCsv: (formData) =>
    axiosInstance.post("/admin/inventory/import", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  getAdminSlides: () => axiosInstance.get("/admin/hero-slides"),
  createSlide: (data) => axiosInstance.post("/admin/hero-slides", data),
  updateSlide: (id, data) => axiosInstance.put(`/admin/hero-slides/${id}`, data),
  deleteSlide: (id) => axiosInstance.delete(`/admin/hero-slides/${id}`),
  reorderSlides: (orderedIds) => axiosInstance.patch("/admin/hero-slides/reorder", { orderedIds }),

  getCoupons: () => axiosInstance.get("/admin/coupons"),
  createCoupon: (data) => axiosInstance.post("/admin/coupons", data),
  updateCoupon: (id, data) => axiosInstance.put(`/admin/coupons/${id}`, data),
  deleteCoupon: (id) => axiosInstance.delete(`/admin/coupons/${id}`),

  updateShippingZone: (id, data) => axiosInstance.put(`/admin/shipping-zones/${id}`, data),
  updateSettings: (data) => axiosInstance.patch("/admin/settings", data),
};
