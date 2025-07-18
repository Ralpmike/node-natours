const express = require('express');
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const qs = require('qs');
const morgan = require('morgan');
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
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server!`,
  // });
  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.statusCode = 404;
  err.status = 'fail';

  next(err);
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
