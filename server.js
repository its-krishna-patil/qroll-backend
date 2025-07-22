import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.send("✅ QRoll backend is running");
});

// Start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("🟢 Connected to MongoDB");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const qrRoutes = require("./routes/qr");
app.use("/api", qrRoutes);
