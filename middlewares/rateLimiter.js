const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
  windowMS: 15 * 60 * 100,
  max: 100,
});

module.exports = rateLimiter;
