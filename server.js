const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const { startQRJob } = require('./utils/qrGenerator');

// Import routes
const authRoutes = require('./routes/authRoutes');
const qrRoutes = require('./routes/qrRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const adminRoutes = require('./routes/adminRoutes');
const adminAuthRoutes = require('./routes/adminAuthRoutes');

const app = express();

// ✅ CORS FIX: Allow frontend from Vercel
app.use(cors({
  origin: "https://qroll-frontend.vercel.app", // 🔐 Your Vercel frontend domain
  credentials: true
}));

app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    startQRJob();
  })
  .catch((err) => console.error('❌ MongoDB error:', err));

// Health check route for Railway
app.get('/', (req, res) => {
  res.json({ message: 'API is running ✅' });
});

// Use API routes
app.use('/api', authRoutes);
app.use('/api', qrRoutes);
app.use('/api', attendanceRoutes);
app.use('/api', adminRoutes);
app.use('/api', adminAuthRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
