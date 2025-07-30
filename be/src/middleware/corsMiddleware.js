// middleware/corsMiddleware.js
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100, // maksimal 100 request/IP dalam 15 menit
  message: 'Too many requests from this IP, please try again later.'
});

const corsMiddleware = (app) => {
  const corsOptions = {
    origin: process.env.FRONT_END_URL
      ? process.env.FRONT_END_URL.split(',')
      : ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  };

  app.use(limiter);
  app.use(cors(corsOptions));
};

module.exports = { corsMiddleware };
