const cron = require("node-cron");
const jwt = require("jsonwebtoken");
const Session = require("../models/Session");

let qrTokens = {}; // Memory store for current QR per room

function generateToken(sessionId) {
  return jwt.sign(
    { sessionId },
    process.env.JWT_SECRET,
    { expiresIn: "60s" } // Token valid for 1 min
  );
}

function startQRJob() {
  cron.schedule("* * * * * *", async () => {
    const activeSessions = await Session.find({ isActive: true });
    activeSessions.forEach((session) => {
      const token = generateToken(session._id.toString());
      qrTokens[session.roomId] = token;
    });
  });
}

function getTokenForRoom(roomId) {
  return qrTokens[roomId] || null;
}

module.exports = { startQRJob, getTokenForRoom };
