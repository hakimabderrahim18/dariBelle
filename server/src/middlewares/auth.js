import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendError } from "../utils/apiResponse.js";

export const authenticate = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return sendError(res, 401, "Non authentifié. Veuillez vous connecter.");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET || "daribelle_super_secret_access_key_2026_jwt_token"
    );

    const user = await User.findById(decoded.id).select("-password");
    if (!user || !user.isActive) {
      return sendError(res, 401, "Compte utilisateur introuvable ou désactivé.");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return sendError(res, 401, "Token expiré. Veuillez rafraîchir la session.", { expired: true });
    }
    return sendError(res, 401, "Token invalide.");
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return sendError(res, 403, "Accès refusé. Vous n'avez pas les autorisations nécessaires.");
    }
    next();
  };
};
