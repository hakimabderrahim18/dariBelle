import User from "../models/User.js";
import { generateTokens } from "../utils/generateTokens.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendError(res, 400, "Veuillez fournir l'adresse email et le mot de passe.");
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return sendError(res, 401, "Identifiants invalides.");
    }

    if (!user.isActive) {
      return sendError(res, 403, "Votre compte a été désactivé.");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 401, "Identifiants invalides.");
    }

    const { accessToken, refreshToken } = generateTokens(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000, // 15 mins
    });

    return sendSuccess(res, 200, "Connexion réussie.", {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!token) {
      return sendError(res, 401, "Aucun jeton de rafraîchissement fourni.");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET || "daribelle_super_secret_refresh_key_2026_refresh_jwt"
    );

    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return sendError(res, 401, "Utilisateur introuvable ou inactif.");
    }

    const tokens = generateTokens(user);

    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    return sendSuccess(res, 200, "Jeton rafraîchi avec succès.", {
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    return sendError(res, 401, "Jeton de rafraîchissement invalide ou expiré.");
  }
};

export const logout = async (req, res) => {
  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");
  return sendSuccess(res, 200, "Déconnexion réussie.");
};

export const getMe = async (req, res) => {
  return sendSuccess(res, 200, "Profil récupéré.", {
    user: req.user,
  });
};
