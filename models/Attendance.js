const express = require("express");
const jwt = require("jsonwebtoken");
const Attendance = require("../models/Attendance");
const Session = require("../models/Session");
const getDistance = require("../utils/distance");
const generateCSV = require("../utils/reportGenerator");

const router = express.Router();

// Unified submit route
router.post("/attendance/submit", async (req, res) => {
  try {
    const { token, gps } = req.body;
    if (!token || !gps) return res.status(400).json({ msg: "Missing data" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const session = await Session.findById(decoded.sessionId);
    if (!session || !session.isActive) {
      return res.status(400).json({ msg: "Invalid or inactive session" });
    }

    const classroomLat = 28.6139;
    const classroomLon = 77.2090;
    const distance = getDistance(gps.lat, gps.lon, classroomLat, classroomLon);

    if (distance > 100) {
      return res.status(403).json({ msg: "You are too far from classroom" });
    }

    const studentId = decoded.userId;
    const already = await Attendance.findOne({ sessionId: session._id, studentId });
    if (already) return res.status(409).json({ msg: "Already marked" });

    const att = new Attendance({ sessionId: session._id, studentId, gps });
    await att.save();

    res.json({ msg: "✅ Attendance marked" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ msg: "❌ Token expired or invalid" });
  }
});

// Report download route
router.get("/attendance/report/:sessionId", async (req, res) => {
  try {
    await generateCSV(req.params.sessionId);
    res.download("report.csv");
  } catch (err) {
    res.status(500).json({ msg: "Report failed", error: err.message });
  }
});

module.exports = router;
