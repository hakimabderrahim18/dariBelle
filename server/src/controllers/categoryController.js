import Category from "../models/Category.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find()
      .populate("parent", "name slug")
      .sort({ order: 1, createdAt: 1 });
    return sendSuccess(res, 200, "Catégories récupérées.", categories);
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const data = req.body;
    if (!data.slug && data.name?.fr) {
      data.slug = data.name.fr
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }
    const category = await Category.create(data);
    return sendSuccess(res, 201, "Catégorie créée.", category);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await Category.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return sendError(res, 404, "Catégorie non trouvée.");
    return sendSuccess(res, 200, "Catégorie mise à jour.", updated);
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) return sendError(res, 404, "Catégorie non trouvée.");
    return sendSuccess(res, 200, "Catégorie supprimée.");
  } catch (error) {
    next(error);
  }
};
