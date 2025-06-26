const fs = require('fs');
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// ?Middlewares
app.use(express.json());

// ?Routes
const filePath = path.join(__dirname, 'dev-data', 'data', 'tours-simple.json');
const data = fs.readFileSync(filePath, 'utf-8');
const tours = JSON.parse(data);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

app.get('/api/v1/tours/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (tours.length < id) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

app.post('/api/v1/tours', (req, res) => {
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
});

const port = process.env.PORT || 3000;
// app.use(express.static('public'));

app.listen(port, () => {
  console.log('App running on port 3000...');
});
