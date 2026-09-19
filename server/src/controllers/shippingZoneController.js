import ShippingZone from "../models/ShippingZone.js";
import { ALGERIA_WILAYAS } from "../utils/wilayasAlgeria.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

export const getShippingZones = async (req, res, next) => {
  try {
    let zones = await ShippingZone.find().sort({ wilayaCode: 1 });
    if (zones.length === 0) {
      // Auto-populate with 58 wilayas if empty
      const initialZones = ALGERIA_WILAYAS.map((w) => ({
        wilayaCode: w.code,
        wilaya: { fr: `${w.code} - ${w.nameFr}`, ar: `${w.code} - ${w.nameAr}` },
        fee: w.fee,
        deskFee: Math.max(250, w.fee - 200),
        deliveryDays: w.deliveryDays,
        isActive: true,
      }));
      zones = await ShippingZone.insertMany(initialZones);
    }
    return sendSuccess(res, 200, "Zones de livraison récupérées.", zones);
  } catch (error) {
    next(error);
  }
};

export const updateShippingZone = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await ShippingZone.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return sendError(res, 404, "Zone de livraison non trouvée.");
    return sendSuccess(res, 200, "Frais de livraison mis à jour.", updated);
  } catch (error) {
    next(error);
  }
};
