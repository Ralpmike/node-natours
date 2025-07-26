const express = require('express');
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const qs = require('qs');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController.controller');
const tourRouter = require('./routes/tourRouter.routes');
const userRouter = require('./routes/userRouter.routes');

const app = express();

const staticFilePath = path.join(__dirname, 'public');

// ?Middlewares
app.set('query parser', (str) => qs.parse(str));

// app.set('query parser', (str) => qs.parse(str, { allowPrototypes: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(staticFilePath));

// ?Mounting the routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.use((req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.statusCode = 404;
  // err.status = 'fail';

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
