const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const bodyParser = require('body-parser');
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const qs = require('qs');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController.controller');
const tourRouter = require('./routes/tourRouter.routes');
const userRouter = require('./routes/userRouter.routes');
const sanitizeInput = require('./middleware/sanitize-xss.middleware');

const app = express();

const staticFilePath = path.join(__dirname, 'public');

// ? 1. GLOBAL Middlewares
//? Security HTTP headers
app.use(helmet());

//?
app.set('query parser', (str) => qs.parse(str));

//? Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//? Limit requests from same API
const limiter = rateLimit({
  limit: 100,
  windowMs: 60 * 60 * 1000,
  message: {
    error: 'Too many requests from this IP, please try again in an hour!',
  },
});

app.use('/api', limiter);

//? Body parser
// app.use(express.json({ limit: '10kb' }));
app.use(bodyParser.json({ limit: '10kb' }));
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

//? Data sanitization against NoSQL injection:Prevent attacks against NoSQL injection
app.use(
  mongoSanitize({
    replaceWith: '_',
  }),
);

//?Data sanitization against XSS :Prevent attacks against XSS
app.use(sanitizeInput);

//? Serving static files
app.use(express.static(staticFilePath));

// ?Mounting the routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//? 404 handler
app.use((req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.statusCode = 404;
  // err.status = 'fail';

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//? Global error handler
app.use(globalErrorHandler);

module.exports = app;
