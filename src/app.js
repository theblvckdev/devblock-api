const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');

const authRouter = require('./routes/authRoutes');

const globalErrorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware that set HTTP headers
app.use(helmet());

// Rate limit middleware
const limiter = rateLimit({
  // number of request
  max: 100,
  // Number of seconds between requests
  windowMs: 60 * 60 * 1000, // 1 hour
  message: `Too many request from this IP, try again in 1 hour`,
});
app.use('/api', limiter);

// Middleware that performs data sanitization againts XXS
app.use(xss());
// Middleware that performs body Parsering, reading data from the request body and storing it in req.body
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/user/', authRouter);

// Handling unhandled endpoints
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: `fail`,
    message: `404 ${req.originalUrl} not found on the server.`,
  });

  next();
});

app.use(globalErrorHandler);

module.exports = app;
