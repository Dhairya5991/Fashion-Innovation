import express from "express";
import mongoose from "mongoose";

const router = express.Router();

router.get("/health", async (req, res) => {
  const mongoState = mongoose.connection.readyState;

  const mongoStatus =
    mongoState === 1 ? "connected" :
    mongoState === 2 ? "connecting" :
    mongoState === 0 ? "disconnected" :
    "unknown";

  res.status(200).json({
    status: "UP",
    service: "backend",
    timestamp: new Date().toISOString(),
    mongo: mongoStatus
  });
});

export default router;
