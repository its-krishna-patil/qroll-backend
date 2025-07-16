const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  course: String,
  startTime: Date,
  endTime: Date,
  isActive: Boolean
});

module.exports = mongoose.model("Session", sessionSchema);
