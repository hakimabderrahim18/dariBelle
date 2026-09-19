import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalOrders,
      pendingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      allOrders,
      todayOrders,
      monthOrders,
      thirtyDaysOrders,
      lowStockProducts,
      outOfStockProducts,
      totalProductsCount,
      topProducts,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: "pending" }),
      Order.countDocuments({ status: "shipped" }),
      Order.countDocuments({ status: "delivered" }),
      Order.countDocuments({ status: "cancelled" }),
      Order.find({ status: { $nin: ["cancelled"] } }).select("total createdAt status"),
      Order.find({ createdAt: { $gte: startOfToday }, status: { $nin: ["cancelled"] } }).select("total"),
      Order.find({ createdAt: { $gte: startOfMonth }, status: { $nin: ["cancelled"] } }).select("total"),
      Order.find({ createdAt: { $gte: thirtyDaysAgo } }).select("total createdAt status"),
      Product.countDocuments({ stock: { $gt: 0, $lte: 5 } }),
      Product.countDocuments({ stock: { $lte: 0 } }),
      Product.countDocuments(),
      Product.find().sort({ soldCount: -1 }).limit(5).select("name images price soldCount stock"),
    ]);

    const totalRevenue = allOrders.reduce((acc, o) => acc + (o.total || 0), 0);
    const todayRevenue = todayOrders.reduce((acc, o) => acc + (o.total || 0), 0);
    const monthRevenue = monthOrders.reduce((acc, o) => acc + (o.total || 0), 0);

    // Build 30-day series for Recharts
    const salesMap = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toISOString().slice(5, 10); // MM-DD
      salesMap[dateStr] = { date: dateStr, sales: 0, orders: 0 };
    }

    thirtyDaysOrders.forEach((order) => {
      const dateStr = new Date(order.createdAt).toISOString().slice(5, 10);
      if (salesMap[dateStr]) {
        salesMap[dateStr].orders += 1;
        if (order.status !== "cancelled") {
          salesMap[dateStr].sales += order.total;
        }
      }
    });

    const salesSeries = Object.values(salesMap);

    // Orders by status
    const statusDistribution = [
      { name: "En attente", count: pendingOrders, color: "#F2A81D" },
      { name: "Expédiées", count: shippedOrders, color: "#3FB8A8" },
      { name: "Livrées", count: deliveredOrders, color: "#28A745" },
      { name: "Annulées", count: cancelledOrders, color: "#D42A52" },
    ];

    // Categories with products
    const categories = await Category.find().select("name slug");
    const categoryStats = await Promise.all(
      categories.map(async (cat) => {
        const count = await Product.countDocuments({ category: cat._id });
        return {
          id: cat._id,
          name: cat.name.fr,
          count,
        };
      })
    );

    return sendSuccess(res, 200, "Statistiques récupérées.", {
      kpis: {
        totalRevenue,
        monthRevenue,
        todayRevenue,
        totalOrders,
        pendingOrders,
        deliveredOrders,
        averageOrderValue: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0,
        lowStockProducts,
        outOfStockProducts,
        totalProductsCount,
      },
      salesSeries,
      statusDistribution,
      topProducts,
      categoryStats,
    });
  } catch (error) {
    next(error);
  }
};
