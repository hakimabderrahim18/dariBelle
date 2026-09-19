import jwt from "jsonwebtoken";

export const generateTokens = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
    name: user.name,
  };

  const accessToken = jwt.sign(
    payload,
    process.env.JWT_ACCESS_SECRET || "daribelle_super_secret_access_key_2026_jwt_token",
    { expiresIn: process.env.JWT_ACCESS_EXPIRY || "15m" }
  );

  const refreshToken = jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET || "daribelle_super_secret_refresh_key_2026_refresh_jwt",
    { expiresIn: process.env.JWT_REFRESH_EXPIRY || "7d" }
  );

  return { accessToken, refreshToken };
};
