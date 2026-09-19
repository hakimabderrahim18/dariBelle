import Brand from "../models/Brand.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

export const getBrands = async (req, res, next) => {
  try {
    const brands = await Brand.find().sort({ name: 1 });
    return sendSuccess(res, 200, "Marques récupérées.", brands);
  } catch (error) {
    next(error);
  }
};

export const createBrand = async (req, res, next) => {
  try {
    const brand = await Brand.create(req.body);
    return sendSuccess(res, 201, "Marque créée.", brand);
  } catch (error) {
    next(error);
  }
};

export const updateBrand = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await Brand.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return sendError(res, 404, "Marque non trouvée.");
    return sendSuccess(res, 200, "Marque mise à jour.", updated);
  } catch (error) {
    next(error);
  }
};

export const deleteBrand = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Brand.findByIdAndDelete(id);
    if (!deleted) return sendError(res, 404, "Marque non trouvée.");
    return sendSuccess(res, 200, "Marque supprimée.");
  } catch (error) {
    next(error);
  }
};
