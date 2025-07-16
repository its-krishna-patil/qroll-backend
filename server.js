const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const { startQRJob } = require('./utils/qrGenerator');

const authRoutes = require('./routes/authRoutes');
const qrRoutes = require('./routes/qrRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const adminRoutes = require('./routes/adminRoutes');
const adminAuthRoutes = require('./routes/adminAuthRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    startQRJob();
  })
  .catch((err) => console.error('❌ MongoDB error:', err));

// Use routes
app.use('/api', authRoutes);
app.use('/api', qrRoutes);
app.use('/api', attendanceRoutes);
app.use('/api', adminRoutes);
app.use('/api', adminAuthRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
