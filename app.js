const express = require('express');
const path = require('path');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRouter.routes');
const userRouter = require('./routes/userRouter.routes');

const app = express();

const staticFilePath = path.join(__dirname, 'public');
// ?Middlewares
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(staticFilePath));
app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
});

app.use((req, res, next) => {
  console.log('Hello from the middleware 👋👍');
  req.requestedAt = new Date().toISOString();

  next();
});

//? user routes

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);
// app.use(express.static('public'));

// ?Routes

// ?Mounting the routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
