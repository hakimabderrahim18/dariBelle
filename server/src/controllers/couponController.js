import Coupon from "../models/Coupon.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

export const validateCoupon = async (req, res, next) => {
  try {
    const { code, orderAmount } = req.body;
    if (!code) return sendError(res, 400, "Veuillez fournir un code coupon.");

    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim(), isActive: true });
    if (!coupon) {
      return sendError(res, 404, "Code promo invalide ou expiré.");
    }

    if (coupon.expiresAt && new Date() > new Date(coupon.expiresAt)) {
      return sendError(res, 400, "Ce code promo a expiré.");
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return sendError(res, 400, "La limite d'utilisation de ce code est atteinte.");
    }

    if (orderAmount && coupon.minOrder && Number(orderAmount) < coupon.minOrder) {
      return sendError(
        res,
        400,
        `Montant minimum requis pour ce coupon : ${coupon.minOrder.toLocaleString("fr-DZ")} DZD.`
      );
    }

    let discount = 0;
    if (coupon.type === "percent") {
      discount = Math.round(((Number(orderAmount) || 0) * coupon.value) / 100);
    } else {
      discount = coupon.value;
    }

    return sendSuccess(res, 200, "Coupon valide.", {
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      discount,
    });
  } catch (error) {
    next(error);
  }
};

export const getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    return sendSuccess(res, 200, "Coupons récupérés.", coupons);
  } catch (error) {
    next(error);
  }
};

export const createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    return sendSuccess(res, 201, "Coupon créé.", coupon);
  } catch (error) {
    next(error);
  }
};

export const updateCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await Coupon.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return sendError(res, 404, "Coupon non trouvé.");
    return sendSuccess(res, 200, "Coupon mis à jour.", updated);
  } catch (error) {
    next(error);
  }
};

export const deleteCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Coupon.findByIdAndDelete(id);
    if (!deleted) return sendError(res, 404, "Coupon non trouvé.");
    return sendSuccess(res, 200, "Coupon supprimé.");
  } catch (error) {
    next(error);
  }
};
