const express = require('express');
require('dotenv').config();
const connectDB = require('./db');
const authRoutes = require('./routes/auth');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path'); // ✅ Needed to serve frontend

const app = express();

// ✅ Security middleware
app.use(helmet());

// ✅ CORS setup
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://yourfrontend.com'
];
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (!allowedOrigins.includes(origin)) {
      return callback(new Error('Not allowed by CORS'), false);
    }
    return callback(null, true);
  }
}));

// ✅ Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// ✅ Connect to DB
connectDB();

// ✅ JSON parser
app.use(express.json());

// ✅ API routes
app.use('/api/auth', authRoutes);

// ✅ Serve frontend build (React/Vite) - Add this
app.use(express.static(path.join(__dirname, 'client/build')));

// ✅ Handle all other routes - prevents "Cannot GET /"
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
