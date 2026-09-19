import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`✨ DARI BELLE API SERVER RUNNING ON PORT ${PORT} ✨`);
      console.log(`📍 Location : Tiaret, Algérie`);
      console.log(`👑 Slogan   : 3AMRI DAREK M3ANA | La Beauté a Son Adresse`);
      console.log(`🌐 Base URL : http://localhost:${PORT}/api/v1`);
      console.log(`=======================================================`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
