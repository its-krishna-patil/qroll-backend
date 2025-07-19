const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Registration Controller
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, role });
    await user.save();

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Unified Login Controller
exports.login = async (req, res) => {
  const { email, password, role } = req.body; // <-- NOTE: role is expected here

  try {
    // Match both email and role
    const user = await User.findOne({ email, role });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token, user: { name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// (Optional) Admin-only login, can be removed if unified login is used everywhere
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied ❌ Not an admin" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });

    res.json({ token, user: { name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
