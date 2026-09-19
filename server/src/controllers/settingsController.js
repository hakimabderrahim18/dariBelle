import Settings from "../models/Settings.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

export const getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        storeName: "Dari Belle",
        slogans: {
          luxury: "LUXURY LIFESTYLE",
          ar: "3AMRI DAREK M3ANA",
          fr: "La Beauté a Son Adresse",
        },
        address: {
          wilaya: "Tiaret",
          street: "Route Lacadémie, à côté du Printemps",
          country: "Algérie",
        },
        phones: ["06 59 40 84 03", "05 51 00 70 98"],
        emails: ["contact@daribelle-dz.com"],
      });
    }
    return sendSuccess(res, 200, "Paramètres récupérés.", settings);
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(req.body);
    } else {
      settings = await Settings.findByIdAndUpdate(settings._id, req.body, { new: true });
    }
    return sendSuccess(res, 200, "Paramètres mis à jour.", settings);
  } catch (error) {
    next(error);
  }
};
