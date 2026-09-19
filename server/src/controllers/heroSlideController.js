import HeroSlide from "../models/HeroSlide.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

export const getActiveSlides = async (req, res, next) => {
  try {
    const now = new Date();
    const slides = await HeroSlide.find({
      isActive: true,
      $and: [
        { $or: [{ startsAt: null }, { startsAt: { $lte: now } }] },
        { $or: [{ endsAt: null }, { endsAt: { $gte: now } }] },
      ],
    }).sort({ order: 1 });

    return sendSuccess(res, 200, "Bannières actives récupérées.", slides);
  } catch (error) {
    next(error);
  }
};

export const getAllSlides = async (req, res, next) => {
  try {
    const slides = await HeroSlide.find().sort({ order: 1, createdAt: -1 });
    return sendSuccess(res, 200, "Toutes les bannières.", slides);
  } catch (error) {
    next(error);
  }
};

export const createSlide = async (req, res, next) => {
  try {
    const slide = await HeroSlide.create(req.body);
    return sendSuccess(res, 201, "Bannière créée.", slide);
  } catch (error) {
    next(error);
  }
};

export const updateSlide = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await HeroSlide.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return sendError(res, 404, "Bannière non trouvée.");
    return sendSuccess(res, 200, "Bannière mise à jour.", updated);
  } catch (error) {
    next(error);
  }
};

export const deleteSlide = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await HeroSlide.findByIdAndDelete(id);
    if (!deleted) return sendError(res, 404, "Bannière non trouvée.");
    return sendSuccess(res, 200, "Bannière supprimée.");
  } catch (error) {
    next(error);
  }
};

export const reorderSlides = async (req, res, next) => {
  try {
    const { orderedIds } = req.body; // Array of IDs in new order
    if (!Array.isArray(orderedIds)) return sendError(res, 400, "orderedIds doit être un tableau.");

    const updates = orderedIds.map((id, index) =>
      HeroSlide.findByIdAndUpdate(id, { order: index })
    );
    await Promise.all(updates);

    return sendSuccess(res, 200, "Ordre des bannières mis à jour.");
  } catch (error) {
    next(error);
  }
};
