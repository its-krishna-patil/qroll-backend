const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
  },
  role: {
    type: String,
    enum: ["student", "admin"],
    default: "student",
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("User", userSchema);
