const express = require("express");
const Session = require("../models/Session");
const adminAuth = require("../middleware/adminAuthMiddleware");

const router = express.Router();

// ✅ Create a new session (admin only)
router.post("/add-session", adminAuth, async (req, res) => {
  try {
    const session = new Session(req.body);
    await session.save();
    res.json({ msg: "Session created", session });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;