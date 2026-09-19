import { sendError } from "../utils/apiResponse.js";

export const errorHandler = (err, req, res, next) => {
  console.error("[Global Error Handler]:", err);

  if (err.name === "CastError") {
    return sendError(res, 400, `Identifiant invalide : ${err.value}`);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "champ";
    return sendError(res, 409, `La valeur pour le champ '${field}' existe déjà.`);
  }

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return sendError(res, 400, "Erreur de validation des données.", errors);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Erreur interne du serveur";

  return sendError(res, statusCode, message, process.env.NODE_ENV === "development" ? err.stack : null);
};
