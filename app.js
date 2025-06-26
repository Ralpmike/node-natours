const fs = require('fs');
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const { error } = require('console');

dotenv.config();

const app = express();

// ?Middlewares
app.use(express.json());

app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
});

app.use((req, res, next) => {
  console.log('Hello from the middleware 👋👍');
  req.requestedAt = new Date().toISOString();

  next();
});

// ?Routes
const filePath = path.join(__dirname, 'dev-data', 'data', 'tours-simple.json');
const data = fs.readFileSync(filePath, 'utf-8');
const tours = JSON.parse(data);

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestedAt,
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const tour = tours.find((el) => el.id === id);

  // if (tours.length < id) {
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  // const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);

  fs.writeFile(filePath, JSON.stringify(tours), (err) => {
    console.log(err);
  });

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
};

const updateTour = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const tourIndex = tours.findIndex((el) => el.id === id);

  if (tourIndex === -1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  const updateTour = {
    ...tours[tourIndex],
    ...req.body,
  };

  tours[tourIndex] = updateTour;

  fs.writeFile(filePath, JSON.stringify(tours, null, 2), (err) => {
    if (err) {
      return res.status(500).json({
        status: 'error',
        message: "Couldn't update data",
        error: {
          message: err,
        },
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Updated successfully',
      data: {
        tour: updateTour,
      },
    });
  });
};

const deleteTour = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const tourIndex = tours.findIndex((el) => el.id === id);

  if (tourIndex === -1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  tours.splice(tourIndex, 1);

  fs.writeFile(filePath, JSON.stringify(tours, null, 2), (err) => {
    if (err) {
      return res.status(500).json({
        status: 'error',
        message: "Couldn't delete data",
        error: {
          message: err,
        },
      });
    }

    res.status(204).json({
      status: 'success',
      message: 'Deleted successfully',
      data: null,
    });
  });
};

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours').get(getAllTours).post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

const port = process.env.PORT || 3000;
// app.use(express.static('public'));

app.listen(port, () => {
  console.log('App running on port 3000...');
});
