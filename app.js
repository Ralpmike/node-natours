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
app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
});

// ?Mounting the routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
