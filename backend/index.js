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

// ✅ CORS setup (only allow your frontend)
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',     // Local dev
  'https://yourfrontend.com'   // Replace with actual Render/Netlify frontend URL
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow same-origin / Postman
    if (!allowedOrigins.includes(origin)) {
      return callback(new Error('Not allowed by CORS'), false);
    }
    return callback(null, true);
  }
}));

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
