import express from "express";
import { login, refreshToken, logout, getMe } from "../controllers/authController.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);
router.get("/me", authenticate, getMe);

export default router;
