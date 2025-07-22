const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Token', tokenSchema);
