import Order from "../models/Order.js";
import Product from "../models/Product.js";
import ShippingZone from "../models/ShippingZone.js";
import Coupon from "../models/Coupon.js";
import Settings from "../models/Settings.js";
import { recordStockMovement } from "../services/stockService.js";
import { generateOrderInvoice } from "../services/invoicePdfService.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

export const createOrder = async (req, res, next) => {
  try {
    const { items, customer, couponCode, isDeskDelivery = false } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return sendError(res, 400, "Le panier est vide.");
    }

    if (!customer || !customer.name || !customer.phone || !customer.wilaya) {
      return sendError(res, 400, "Veuillez renseigner le nom, téléphone et la wilaya.");
    }

    // Verify products and calculate subtotal
    let subtotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product || !product.isPublished) {
        return sendError(res, 400, `Le produit n'est plus disponible.`);
      }

      let price = product.salePrice && product.salePrice < product.price ? product.salePrice : product.price;

      // Check variant if applicable
      if (item.variantSku) {
        const variant = product.variants?.find((v) => v.sku === item.variantSku);
        if (variant) {
          price = variant.price;
          if (variant.stock < item.quantity) {
            return sendError(res, 400, `Stock insuffisant pour ${product.name.fr} (${variant.name}).`);
          }
        }
      } else if (product.stock < item.quantity) {
        return sendError(res, 400, `Stock insuffisant pour ${product.name.fr}.`);
      }

      const itemTotal = price * item.quantity;
      subtotal += itemTotal;

      verifiedItems.push({
        product: product._id,
        name: product.name.fr,
        image: product.images?.[0] || "",
        price,
        quantity: item.quantity,
        variantSku: item.variantSku || null,
      });
    }

    // Shipping fee calculation
    let shippingFee = 600; // default fallback
    const zone = await ShippingZone.findOne({
      $or: [
        { "wilaya.fr": { $regex: new RegExp(customer.wilaya, "i") } },
        { "wilaya.ar": { $regex: new RegExp(customer.wilaya, "i") } },
      ],
      isActive: true,
    });

    if (zone) {
      shippingFee = isDeskDelivery && zone.deskFee > 0 ? zone.deskFee : zone.fee;
    }

    // Settings for free shipping threshold
    const settings = await Settings.findOne();
    if (settings?.freeShippingThreshold && subtotal >= settings.freeShippingThreshold) {
      shippingFee = 0;
    }

    // Coupon discount
    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase().trim(), isActive: true });
      if (coupon && (!coupon.minOrder || subtotal >= coupon.minOrder)) {
        if (!coupon.expiresAt || new Date() <= new Date(coupon.expiresAt)) {
          if (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit) {
            if (coupon.type === "percent") {
              discount = Math.round((subtotal * coupon.value) / 100);
            } else {
              discount = coupon.value;
            }
            coupon.usedCount += 1;
            await coupon.save();
          }
        }
      }
    }

    const total = Math.max(0, subtotal + shippingFee - discount);
    const orderNumber = `DB-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const order = await Order.create({
      orderNumber,
      items: verifiedItems,
      customer,
      shippingFee,
      subtotal,
      discount,
      total,
      status: "pending",
      coupon: couponCode || null,
      paymentMethod: "COD",
      statusHistory: [
        {
          status: "pending",
          note: "Commande passée avec succès par le client (Paiement à la livraison).",
          date: new Date(),
        },
      ],
    });

    // Deduct stock and record stock movement
    for (const item of verifiedItems) {
      try {
        await recordStockMovement({
          productId: item.product,
          variantSku: item.variantSku,
          type: "out",
          quantity: item.quantity,
          reason: `Commande client #${orderNumber}`,
          reference: orderNumber,
        });

        // Increment sold count
        await Product.findByIdAndUpdate(item.product, { $inc: { soldCount: item.quantity } });
      } catch (e) {
        console.error("Error reducing stock for order:", e);
      }
    }

    return sendSuccess(res, 201, "Commande enregistrée avec succès !", order);
  } catch (error) {
    next(error);
  }
};

export const trackOrder = async (req, res, next) => {
  try {
    const { orderNumber } = req.params;
    const { phone } = req.query;

    const query = { orderNumber: orderNumber.trim().toUpperCase() };
    if (phone) {
      query["customer.phone"] = { $regex: phone.trim().slice(-8) };
    }

    const order = await Order.findOne(query);
    if (!order) {
      return sendError(res, 404, "Aucune commande trouvée avec ces coordonnées.");
    }

    return sendSuccess(res, 200, "Commande trouvée.", order);
  } catch (error) {
    next(error);
  }
};

// Admin Endpoints
export const getOrders = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status && status !== "all") {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: "i" } },
        { "customer.name": { $regex: search, $options: "i" } },
        { "customer.phone": { $regex: search, $options: "i" } },
        { "customer.wilaya": { $regex: search, $options: "i" } },
      ];
    }

    const pageNumber = Math.max(1, parseInt(page));
    const pageSize = Math.max(1, parseInt(limit));
    const skip = (pageNumber - 1) * pageSize;

    const [orders, total] = await Promise.all([
      Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(pageSize),
      Order.countDocuments(query),
    ]);

    return sendSuccess(res, 200, "Commandes récupérées.", orders, {
      total,
      page: pageNumber,
      pages: Math.ceil(total / pageSize),
      limit: pageSize,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate("statusHistory.updatedBy", "name email");
    if (!order) return sendError(res, 404, "Commande introuvable.");
    return sendSuccess(res, 200, "Détails de la commande.", order);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const order = await Order.findById(id);
    if (!order) return sendError(res, 404, "Commande non trouvée.");

    const previousStatus = order.status;
    order.status = status;
    order.statusHistory.push({
      status,
      note: note || `Statut mis à jour vers: ${status}`,
      date: new Date(),
      updatedBy: req.user?._id || null,
    });

    // If cancelled or returned, optionally restock
    if ((status === "cancelled" || status === "returned") && previousStatus !== "cancelled" && previousStatus !== "returned") {
      for (const item of order.items) {
        try {
          await recordStockMovement({
            productId: item.product,
            variantSku: item.variantSku,
            type: "return",
            quantity: item.quantity,
            reason: `Restock suite à annulation/retour commande #${order.orderNumber}`,
            reference: order.orderNumber,
            performedBy: req.user?._id,
          });
        } catch (e) {
          console.error("Restock error:", e);
        }
      }
    }

    await order.save();
    return sendSuccess(res, 200, "Statut de la commande mis à jour.", order);
  } catch (error) {
    next(error);
  }
};

export const getOrderInvoicePdf = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) return sendError(res, 404, "Commande introuvable.");

    const settings = await Settings.findOne();
    const pdfBuffer = await generateOrderInvoice(order, settings);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=facture-daribelle-${order.orderNumber}.pdf`);
    res.setHeader("Content-Length", pdfBuffer.length);

    return res.end(pdfBuffer);
  } catch (error) {
    next(error);
  }
};
