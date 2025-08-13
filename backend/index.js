const express = require('express');
require('dotenv').config();
const connectDB = require('./db');
const authRoutes = require('./routes/auth');
const helmet = require('helmet'); // ✅ Add this

const app = express();

// ✅ Use helmet before routes
app.use(helmet());
const cors = require('cors');

// ✅ Only your frontend domains should be allowed
const allowedOrigins = [
  'http://localhost:3000',      // Local frontend
  'https://yourfrontend.com'    // Live frontend URL
];

// ✅ Apply CORS settings
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (!allowedOrigins.includes(origin)) {
      return callback(new Error('Not allowed by CORS'), false);
    }
    return callback(null, true);
  }
}));

const rateLimit = require('express-rate-limit');

// ✅ Limit all API requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // limit per IP
  message: 'Too many requests from this IP, please try again later.'
});

app.use(limiter);


connectDB();
app.use(express.json());
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
