const express = require("express");
const Session = require("../models/Session");
const Attendance = require("../models/Attendance");
const adminAuth = require("../middleware/adminAuthMiddleware");

const router = express.Router();

// ✅ Get all sessions (admin only)
router.get("/admin/sessions", adminAuth, async (req, res) => {
  try {
    const sessions = await Session.find().sort({ startTime: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch sessions" });
  }
});

// ✅ Get attendance for a session (admin only)
router.get("/admin/attendance/:sessionId", adminAuth, async (req, res) => {
  try {
    const attendance = await Attendance.find({
      sessionId: req.params.sessionId,
    }).populate("studentId");
    res.json(attendance);
  } catch (err) {
    console.error("❌ Error in /admin/attendance route:", err);
    res.status(500).json({ msg: "Failed to fetch attendance" });
  }
});

module.exports = router;
