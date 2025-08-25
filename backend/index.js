const express = require('express');
require('dotenv').config();
const path = require('path');
const connectDB = require('./db');
const authRoutes = require('./routes/auth');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();

// ✅ Security headers
app.use(helmet());

// ✅ CORS setup (allow all origins)
app.use(cors());

// ✅ Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// ✅ Connect DB + body parser
connectDB();
app.use(express.json());

// ✅ API routes
app.use('/api/auth', authRoutes);

// ✅ Serve frontend build
app.use(express.static(path.join(__dirname, '../my-auth-app/dist')));

// ✅ Catch-all: let React handle routing
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../my-auth-app/dist/index.html'));
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
