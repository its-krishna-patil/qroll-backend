const express = require("express");
const router = express.Router();
const { getTokenForRoom } = require("../utils/qrGenerator");
const Session = require("../models/Session");

// ✅ GET QR token for a room
router.get("/qr/:roomId", (req, res) => {
  const token = getTokenForRoom(req.params.roomId);
  if (token) {
    res.json({ qrToken: token });
  } else {
    res.status(404).json({ msg: "No active session for this room" });
  }
});

// ✅ TEMP: POST route to add a session manually (for testing only)
router.post("/add-session", async (req, res) => {
  try {
    const session = new Session(req.body);
    await session.save();
    res.json({ msg: "Session created", session });
  } catch (err) {
    res.status(500).json({ msg: "Error", error: err.message });
  }
});

module.exports = router;


const jwt = require("jsonwebtoken");
const Attendance = require("../models/Attendance");

// Submit attendance via QR
router.post("/attendance/submit", async (req, res) => {
  const { token, gps } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const attendance = new Attendance({
      sessionId: decoded.sessionId,
      gps,
    });
    await attendance.save();
    res.json({ msg: "Attendance saved ✅" });
  } catch (err) {
    res.status(400).json({ msg: "Invalid or expired QR token ❌" });
  }
});
