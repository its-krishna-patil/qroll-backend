const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

let currentToken = null;
let expiry = null;

const generateNewToken = () => {
  const payload = {
    timestamp: Date.now(),
    purpose: "attendance"
  };
  currentToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "10s" }); // short expiry
  expiry = Date.now() + 5000; // 5 sec window
};

generateNewToken(); // initialize once

// Refresh token every 5 seconds
setInterval(generateNewToken, 5000);

// Route to fetch current QR token
router.get("/qr-token", (req, res) => {
  res.json({ token: currentToken, expiresAt: expiry });
});

module.exports = router;
